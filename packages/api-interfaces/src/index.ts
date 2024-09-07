import { Call, MapCall } from '@esmap/types';

export interface GetMapDataResponse {
  calls: MapCall[];
}

export interface GetCallListResponse {
  calls: Call[];
}

export interface GetCallDetailsResponse extends Call {}