import { useEffect, useState } from 'react'
import { Link } from '@remix-run/react'
import type { CallLog, CallLogEntry } from '#app/models/CallLog'

export default function CallList() {
  const [calls, setCalls] = useState<[string, CallLogEntry][]>([])
  const [sources, setSources] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchCallLog() {
      const response = await fetch('/data/call_log.json')
      const data: CallLog = await response.json() as CallLog
      setCalls(Object.entries(data.calls))
      setSources(data.sources)
    }
    fetchCallLog()
    const interval = setInterval(fetchCallLog, 60000) // Refresh every 60 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h1>Call Log</h1>
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Description</th>
            <th>Location</th>
            <th>Call Time</th>
            <th>Closed</th>
          </tr>
        </thead>
        <tbody>
          {calls.map(([id, call]) => (
            <tr key={id}>
              <td>{sources[call.sourceId]}</td>
              <td>
                <Link to={`/call/${id}`}>{call.description}</Link>
              </td>
              <td>{call.location}</td>
              <td>{call.callTime}</td>
              <td>{call.closed ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}