export type LiveMapEntry = [number, number, string, string];

export interface LiveMap {
  calls: Record<string, LiveMapEntry>;
  updated: number;
}