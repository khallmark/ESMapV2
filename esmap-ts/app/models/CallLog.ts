export interface CallLog {
  updated: number
  sources: Record<string, string>
  calls: Record<string, CallLogEntry>
}

export interface CallLogEntry {
  sourceId: number
  description: string
  location: string
  callTime: string
  closed: string | null
}