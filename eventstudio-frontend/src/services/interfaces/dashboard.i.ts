export interface IDashboardStatus {
  spaceId: number;
  spaceName: string;
  totalEvents: number;
  totalSpaceUsers: number;
  totalVolunteers: number;
  totalRecentVolunteers: number;
  totalSponsors: number;
  totalRecentSponsors: number;
  speakerOnboards: number;
  speakerRecentOnboards: number;
  upcomingEvents: {
    endDate: string;
    eventId: number;
    startDate: string;
    eventName: string;
    venueName: string;
    luma: string;
    meetup: string;
    eventbrite: string;
  }[];
  inactiveEvents: {
    endDate: string;
    eventId: number;
    startDate: string;
    eventName: string;
    venueName: string;
  }[];
  lastUpdated: string;
}
