import { useEffect, useRef, useState } from "react";
import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import proj4 from "proj4";
import "leaflet/dist/leaflet.css";

interface SumoPoint {
  x: number;
  y: number;
}

interface GeoConverter {
  toLatLng: (point: SumoPoint) => LatLngExpression;
  fallbackBounds: LatLngBoundsExpression;
}

interface ParsedNetwork {
  roadLines: LatLngExpression[][];
  edgeShapes: Map<string, SumoPoint[]>;
  laneShapes: Map<string, SumoPoint[]>;
  laneCount: number;
  converter: GeoConverter;
}

interface MapSummary {
  lanes: number;
  evRoutes: number;
  chargingStations: number;
}

interface StationMarker {
  id: string;
  latLng: LatLngExpression;
  powerKw: number;
}

const baseUrl = import.meta.env.BASE_URL;

const mapFiles = {
  network: `${baseUrl}map/most.net.xml`,
  evRoutes: `${baseUrl}map/route/most.ev.rou.xml`,
  chargingStations: `${baseUrl}map/add/charging_stations.add.xml`,
};

const monacoBounds: LatLngBoundsExpression = [
  [43.718985, 7.362913],
  [43.776857, 7.485778],
];

function parseNumber(value: string | null, fallback = 0) {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseShape(shape: string | null): SumoPoint[] {
  if (!shape) {
    return [];
  }

  return shape
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    })
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

function parseBoundary(value: string | null, fallback: [number, number, number, number]) {
  if (!value) {
    return fallback;
  }

  const values = value.split(",").map(Number);
  return values.length === 4 && values.every(Number.isFinite)
    ? (values as [number, number, number, number])
    : fallback;
}

function parsePair(value: string | null, fallback: [number, number]) {
  if (!value) {
    return fallback;
  }

  const values = value.split(",").map(Number);
  return values.length === 2 && values.every(Number.isFinite)
    ? (values as [number, number])
    : fallback;
}

function buildConverter(location: Element | null): GeoConverter {
  const netOffset = parsePair(location?.getAttribute("netOffset") ?? null, [0, 0]);
  const convBoundary = parseBoundary(location?.getAttribute("convBoundary") ?? null, [
    0, 0, 9975.22, 6362.01,
  ]);
  const origBoundary = parseBoundary(location?.getAttribute("origBoundary") ?? null, [
    7.362913, 43.718985, 7.485778, 43.776857,
  ]);
  const projParameter = location?.getAttribute("projParameter");
  const fallbackBounds: LatLngBoundsExpression = [
    [origBoundary[1], origBoundary[0]],
    [origBoundary[3], origBoundary[2]],
  ];

  const fallbackToLatLng = (point: SumoPoint): LatLngExpression => {
    const xRatio = (point.x - convBoundary[0]) / (convBoundary[2] - convBoundary[0]);
    const yRatio = (point.y - convBoundary[1]) / (convBoundary[3] - convBoundary[1]);
    const lon = origBoundary[0] + xRatio * (origBoundary[2] - origBoundary[0]);
    const lat = origBoundary[1] + yRatio * (origBoundary[3] - origBoundary[1]);
    return [lat, lon];
  };

  if (!projParameter || projParameter === "!") {
    return { toLatLng: fallbackToLatLng, fallbackBounds };
  }

  return {
    fallbackBounds,
    toLatLng: (point: SumoPoint) => {
      try {
        const [lon, lat] = proj4(projParameter, "EPSG:4326", [
          point.x - netOffset[0],
          point.y - netOffset[1],
        ]);

        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          return [lat, lon];
        }
      } catch {
        return fallbackToLatLng(point);
      }

      return fallbackToLatLng(point);
    },
  };
}

async function fetchXml(path: string) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  const text = await response.text();
  return new DOMParser().parseFromString(text, "application/xml");
}

async function fetchOptionalXml(path: string, label: string, warnings: string[]) {
  try {
    return await fetchXml(path);
  } catch (error) {
    const message = `${label} file is missing.`;
    warnings.push(message);
    console.warn(`[DatasetMap] ${message}`, error);
    return null;
  }
}

function parseNetwork(document: XMLDocument): ParsedNetwork {
  const converter = buildConverter(document.querySelector("location"));
  const laneShapes = new Map<string, SumoPoint[]>();
  const edgeShapes = new Map<string, SumoPoint[]>();
  const roadShapes: SumoPoint[][] = [];

  document.querySelectorAll("edge").forEach((edge) => {
    if (edge.getAttribute("function") === "internal") {
      return;
    }

    const edgeId = edge.getAttribute("id");
    const lane = edge.querySelector("lane[shape]");
    const shape = parseShape(lane?.getAttribute("shape") ?? null);

    if (edgeId && shape.length > 1) {
      edgeShapes.set(edgeId, shape);
      roadShapes.push(shape);
    }
  });

  document.querySelectorAll("lane[shape]").forEach((lane) => {
    const laneId = lane.getAttribute("id");
    const shape = parseShape(lane.getAttribute("shape"));

    if (laneId && shape.length > 1) {
      laneShapes.set(laneId, shape);
    }
  });

  const laneCount = laneShapes.size;
  const renderEvery = Math.max(1, Math.ceil(roadShapes.length / 2400));
  const roadLines = roadShapes
    .filter((_, index) => index % renderEvery === 0)
    .map((shape) => shape.map(converter.toLatLng));

  return {
    roadLines,
    edgeShapes,
    laneShapes,
    laneCount,
    converter,
  };
}

function buildRouteLine(
  edgeList: string,
  edgeShapes: Map<string, SumoPoint[]>,
  converter: GeoConverter,
): LatLngExpression[] {
  const points: SumoPoint[] = [];

  edgeList
    .trim()
    .split(/\s+/)
    .forEach((edgeId) => {
      const shape = edgeShapes.get(edgeId);

      if (shape) {
        points.push(...shape);
      }
    });

  return points.map(converter.toLatLng);
}

function parseVehicleRoutes(
  document: XMLDocument,
  edgeShapes: Map<string, SumoPoint[]>,
  converter: GeoConverter,
  maxRenderedLines = 150,
) {
  const vehicles = Array.from(document.querySelectorAll("vehicle"));
  const renderEvery = Math.max(1, Math.ceil(vehicles.length / maxRenderedLines));
  const lines = vehicles
    .filter((_, index) => index % renderEvery === 0)
    .map((vehicle) =>
      buildRouteLine(
        vehicle.querySelector("route")?.getAttribute("edges") ?? "",
        edgeShapes,
        converter,
      ),
    )
    .filter((line) => line.length > 1);

  return { lines, total: vehicles.length };
}

function pointAtDistance(shape: SumoPoint[], targetDistance: number) {
  if (shape.length === 0) {
    return null;
  }

  let travelled = 0;

  for (let index = 1; index < shape.length; index += 1) {
    const previous = shape[index - 1];
    const current = shape[index];
    const segmentLength = Math.hypot(current.x - previous.x, current.y - previous.y);

    if (travelled + segmentLength >= targetDistance) {
      const ratio = (targetDistance - travelled) / segmentLength;
      return {
        x: previous.x + (current.x - previous.x) * ratio,
        y: previous.y + (current.y - previous.y) * ratio,
      };
    }

    travelled += segmentLength;
  }

  return shape[shape.length - 1];
}

function parseChargingStations(
  document: XMLDocument,
  laneShapes: Map<string, SumoPoint[]>,
  converter: GeoConverter,
) {
  const stations = Array.from(document.querySelectorAll("chargingStation"));
  const markers: StationMarker[] = stations.flatMap((station) => {
    const laneId = station.getAttribute("lane") ?? "";
    const shape = laneShapes.get(laneId);

    if (!shape) {
      return [];
    }

    const start = parseNumber(station.getAttribute("startPos"), 0);
    const end = parseNumber(station.getAttribute("endPos"), start);
    const point = pointAtDistance(shape, (start + end) / 2);

    if (!point) {
      return [];
    }

    return [
      {
        id: station.getAttribute("id") ?? "charging-station",
        latLng: converter.toLatLng(point),
        powerKw: Math.round(parseNumber(station.getAttribute("power"), 0) / 1000),
      },
    ];
  });

  return { markers, total: stations.length };
}

function addPolylines(
  layer: L.LayerGroup,
  lines: LatLngExpression[][],
  options: L.PolylineOptions,
) {
  lines.forEach((line) => {
    L.polyline(line, options).addTo(layer);
  });
}

function DatasetMap() {
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [summary, setSummary] = useState<MapSummary>({
    lanes: 0,
    evRoutes: 0,
    chargingStations: 0,
  });
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let map: L.Map | null = null;

    async function initMap() {
      if (!mapNodeRef.current) {
        return;
      }

      setIsLoading(true);
      setWarnings([]);

      const nextWarnings: string[] = [];
      let networkDocument: XMLDocument | null = null;
      let evDocument: XMLDocument | null = null;
      let stationDocument: XMLDocument | null = null;

      try {
        networkDocument = await fetchXml(mapFiles.network);
      } catch (error) {
        nextWarnings.push("Road network file is missing.");
        console.warn("[DatasetMap] Road network file is missing.", error);
      }

      await Promise.all([
        fetchOptionalXml(mapFiles.evRoutes, "EV route", nextWarnings).then((document) => {
          evDocument = document;
        }),
        fetchOptionalXml(mapFiles.chargingStations, "Charging station", nextWarnings).then(
          (document) => {
            stationDocument = document;
          },
        ),
      ]);

      if (cancelled) {
        return;
      }

      map = L.map(mapNodeRef.current, {
        center: [43.7384, 7.4246],
        zoom: 13,
        preferCanvas: true,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const roadLayer = L.layerGroup().addTo(map);
      const evLayer = L.layerGroup().addTo(map);
      const stationLayer = L.layerGroup().addTo(map);

      if (!networkDocument) {
        map.fitBounds(monacoBounds);
        setWarnings(nextWarnings);
        setIsLoading(false);
        return;
      }

      const network = parseNetwork(networkDocument);
      addPolylines(roadLayer, network.roadLines, {
        color: "#7b8794",
        weight: 1.1,
        opacity: 0.34,
      });

      const evRoutes = evDocument
        ? parseVehicleRoutes(evDocument, network.edgeShapes, network.converter)
        : { lines: [], total: 0 };
      const stations = stationDocument
        ? parseChargingStations(stationDocument, network.laneShapes, network.converter)
        : { markers: [], total: 0 };

      addPolylines(evLayer, evRoutes.lines, {
        color: "#1b45bb",
        weight: 2,
        opacity: 0.56,
      });

      stations.markers.forEach((station) => {
        L.circleMarker(station.latLng, {
          radius: 5,
          color: "#0f8a3b",
          weight: 2,
          fillColor: "#16a34a",
          fillOpacity: 0.9,
        })
          .bindPopup(
            `<strong>${station.id}</strong><br/>Charging power: ${station.powerKw} kW`,
          )
          .addTo(stationLayer);
      });

      const layersControl = L.control.layers(
        undefined,
        {
          "Road network": roadLayer,
          "EV routes": evLayer,
          "Charging stations": stationLayer,
        },
        { collapsed: true },
      );
      layersControl.addTo(map);

      setSummary({
        lanes: network.laneCount,
        evRoutes: evRoutes.total,
        chargingStations: stations.total,
      });
      setWarnings(nextWarnings);
      setIsLoading(false);

      const bounds = L.latLngBounds([]);
      [...network.roadLines.slice(0, 600), ...evRoutes.lines.slice(0, 80)].forEach((line) => {
        line.forEach((latLng) => bounds.extend(latLng));
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [18, 18], maxZoom: 14 });
      } else {
        map.fitBounds(network.converter.fallbackBounds);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      const instance = mapRef.current ?? map;
      instance?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="cev-map-shell">
      {warnings.length > 0 ? (
        <div className="cev-map-warning" role="status">
          <strong>Some map files are not available yet.</strong>
          <span>
            Missing layers are skipped. Place the SUMO files under{" "}
            <code>web/public/map</code> to enable the complete interactive
            visualization.
          </span>
        </div>
      ) : null}

      <div className="cev-map-summary" aria-label="Dataset map summary">
        <span>
          <strong>{summary.lanes.toLocaleString()}</strong> lanes
        </span>
        <span>
          <strong>{summary.evRoutes.toLocaleString()}</strong> EV routes
        </span>
        <span>
          <strong>{summary.chargingStations.toLocaleString()}</strong> charging stations
        </span>
      </div>

      <div className="cev-leaflet-map" ref={mapNodeRef}>
        {isLoading ? <div className="cev-map-loading">Loading Monaco map...</div> : null}
      </div>

      <div className="cev-map-legend" aria-label="Dataset map legend">
        <span>
          <i className="road" /> Road network
        </span>
        <span>
          <i className="ev" /> EV routes
        </span>
        <span>
          <i className="station" /> Charging station
        </span>
      </div>
    </div>
  );
}

export default DatasetMap;
