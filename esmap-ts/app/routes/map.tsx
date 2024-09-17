import { useEffect, useState } from 'react'
import type { LiveMap, LiveMapEntry } from '#app/models/LiveMap'
import { ClientOnly } from 'remix-utils/client-only'
import { useTheme } from '#app/hooks/useTheme'

// Define a type for the Leaflet components
type LeafletComponents = {
  MapContainer: typeof import('react-leaflet').MapContainer,
  TileLayer: typeof import('react-leaflet').TileLayer,
  Marker: typeof import('react-leaflet').Marker,
  Popup: typeof import('react-leaflet').Popup,
  L: typeof import('leaflet')
}

// Separate component for the map
function MapComponent({ liveMap }: { liveMap: LiveMap }) {
  const [leaflet, setLeaflet] = useState<LeafletComponents | null>(null)
  const theme = useTheme()

  useEffect(() => {
    (async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet')
      await import('leaflet/dist/leaflet.css')
      const L = await import('leaflet')

      // Fix the marker icons
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: (await import('leaflet/dist/images/marker-icon-2x.png')).default,
        iconUrl: (await import('leaflet/dist/images/marker-icon.png')).default,
        shadowUrl: (await import('leaflet/dist/images/marker-shadow.png')).default,
      })

      setLeaflet({ MapContainer, TileLayer, Marker, Popup, L })
    })()
  }, [])

  if (!leaflet) {
    return <div>Loading map...</div>
  }

  const { MapContainer, TileLayer, Marker, Popup } = leaflet

  const tileLayerUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const attribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <div className="h-full w-full">
      <MapContainer center={[28.48449, -81.25188]} zoom={12} className="h-full w-full">
        <TileLayer
          url={tileLayerUrl}
          attribution={attribution}
        />
        {Object.entries(liveMap.calls).map(([id, call]) => {
          const [latitude, longitude, description, category] = call
          const lat = parseFloat(latitude.toFixed(4))
          const lng = parseFloat(longitude.toFixed(4))
          return (
            <Marker key={id} position={[lat, lng]}>
              <Popup>{`${description} (${category})`}</Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default function LiveMapComponent() {
  const [liveMap, setLiveMap] = useState<LiveMap | null>(null)

  useEffect(() => {
    async function fetchLiveMap() {
      const response = await fetch('/data/livemap.json')
      const data = await response.json()
      if (isValidLiveMap(data)) {
        setLiveMap(data)
      } else {
        console.error('Invalid data structure:', data)
        setLiveMap(null)
      }
    }
    fetchLiveMap()
    const interval = setInterval(fetchLiveMap, 60000) // Refresh every 60 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div id="content" className="flex-grow">
        <ClientOnly fallback={<div>Loading map...</div>}>
          {() =>
            liveMap && Object.keys(liveMap.calls).length > 0 ? (
              <MapComponent liveMap={liveMap} />
            ) : (
              <div>No map data available</div>
            )
          }
        </ClientOnly>
      </div>
      <div id="footer" className="bg-header-bg text-white">
        <div id="updateTime" className="p-0.5 text-sm">
          {liveMap ? `Updated: ${new Date(liveMap.updated * 1000).toLocaleString()}` : 'Updating...'}
        </div>
      </div>
    </div>
  )
}

// Helper function to type-check the fetched data
function isValidLiveMap(data: unknown): data is LiveMap {
  if (typeof data !== 'object' || data === null || !('calls' in data)) {
    return false;
  }

  const callsData = (data as { calls: unknown }).calls;
  if (typeof callsData !== 'object' || callsData === null) {
    return false;
  }

  return Object.values(callsData as Record<string, unknown>).every(
    (call): call is LiveMapEntry =>
      Array.isArray(call) &&
      call.length === 4 &&
      typeof call[0] === 'number' &&       // latitude
      typeof call[1] === 'number' &&       // longitude
      typeof call[2] === 'string' &&       // description
      typeof call[3] === 'string'          // category
  );
}