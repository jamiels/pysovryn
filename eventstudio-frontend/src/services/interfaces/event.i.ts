export interface IEvent {
  id: number;
  nanoId: string;
  uuid: string;
  name: string;
  shortName: string;
  landingUrl: string;
  startDate: string;
  endDate: string;
  venueName: number;
  venueId: number;
  user: number;
  isActive: boolean;
  sponsorshipDeckUrl: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
  banner: string;
  meetup: string;
  luma: string;
  eventBrite: string;
  timezone: string;
}

export interface IEventRequest {
  id: number;
  userId: number;
  name: string;
  shortName: string;
  landingUrl: string;
  startdate: string;
  enddate: string;
  starttime: string;
  endtime: string;
  veneue: number;
  theme: string;
  sponsorshipDeckUrl: string;
  space_id: number;
  isActive: boolean;
  meetup?: string;
  luma?: string;
  eventBrite?: string;
  timezone: string;
}

export interface IEventAddRequest {
  userId: number;
  name: string;
  space_id: number;
}
