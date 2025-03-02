export interface IVenue {
  id: number;
  name: string;
  space_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IVenueRequest {
  name: string;
  space_id: number;
}

export interface IVenueUpdateRequest {
  name: string;
  space_id: number;
}
