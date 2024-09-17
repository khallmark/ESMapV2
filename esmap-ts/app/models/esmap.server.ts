import { Call, Source, Geocode } from '@prisma/client'

export interface CallWithRelations extends Call {
  source: Source
  geocode: Geocode | null
}

export interface SourceWithRelations extends Source {
  calls: Call[]
}

export interface GeocodeWithRelations extends Geocode {
  calls: Call[]
}

export const parseCallMeta = (call: Call): Record<string, any> => {
  return JSON.parse(call.meta)
}

export const parseGeocodeResults = (geocode: Geocode): Record<string, any> | null => {
  return geocode.results ? JSON.parse(geocode.results) : null
}