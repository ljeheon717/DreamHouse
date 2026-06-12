import { Property, WatchlistData } from './types';
import { sampleProperties } from './data';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'watchlist.json');

function ensureDataDir() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // read-only filesystem — fall through
  }
}

export function readWatchlist(): WatchlistData {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      const initial: WatchlistData = {
        properties: sampleProperties,
        lastUpdated: new Date().toISOString(),
      };
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
      } catch {
        // can't write — return in-memory default
      }
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as WatchlistData;
  } catch {
    return { properties: sampleProperties, lastUpdated: new Date().toISOString() };
  }
}

export function writeWatchlist(data: WatchlistData): void {
  try {
    ensureDataDir();
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch {
    // silent fail on read-only fs
  }
}

export function addProperty(property: Property): WatchlistData {
  const data = readWatchlist();
  data.properties.push(property);
  writeWatchlist(data);
  return data;
}

export function updateProperty(id: string, updates: Partial<Property>): WatchlistData {
  const data = readWatchlist();
  const idx = data.properties.findIndex((p) => p.id === id);
  if (idx !== -1) {
    data.properties[idx] = { ...data.properties[idx], ...updates };
    writeWatchlist(data);
  }
  return data;
}

export function deleteProperty(id: string): WatchlistData {
  const data = readWatchlist();
  data.properties = data.properties.filter((p) => p.id !== id);
  writeWatchlist(data);
  return data;
}
