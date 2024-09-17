import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '#app/utils/db.server.ts'

// Loader function to fetch call details
export async function loader({ params }: LoaderArgs) {
  const id = params.id
  if (!id || isNaN(Number(id))) {
    throw new Response('Invalid call ID', { status: 400 })
  }

  const call = await prisma.call.findUnique({
    where: { id: Number(id) },
    include: {
      source: true,
      geocode: true,
    },
  })

  if (!call) {
    throw new Response('Call not found', { status: 404 })
  }

  // Convert times to local timezone
  const utcAddedTime = new Date(call.added)
  const localAddedTime = utcAddedTime.toLocaleString('en-US', {
    timeZone: call.source.time_zone,
  })

  const utcExpiredTime = call.expired ? new Date(call.expired) : null
  const localExpiredTime = utcExpiredTime
    ? utcExpiredTime.toLocaleString('en-US', { timeZone: call.source.time_zone })
    : ''

  return json({
    source: call.source.tag,
    category: call.category,
    found: localAddedTime,
    closed: localExpiredTime,
    meta: call.meta,
    latitude: call.geocode?.latitude,
    longitude: call.geocode?.longitude,
  })
}

// React component to display call details
export default function CallDetails() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Call Details - {data.source}</h1>
      <table>
        <tbody>
          <tr><td>Source</td><td>{data.source}</td></tr>
          <tr><td>Category</td><td>{data.category}</td></tr>
          <tr><td>Found</td><td>{data.found}</td></tr>
          <tr><td>Closed</td><td>{data.closed}</td></tr>
          {Object.entries(data.meta).map(([key, value]) => (
            <tr key={key}>
              <td>{key.replace('_', ' ')}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.latitude && data.longitude && (
        <div id="map" style={{ width: '100%', height: '400px' }}>
          {/* Implement map rendering here */}
        </div>
      )}
    </div>
  )
}