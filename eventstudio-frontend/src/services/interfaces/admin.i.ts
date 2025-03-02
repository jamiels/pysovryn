export interface IAdminEvent {
  id: number;
  nanoId: string;
  name: string;
  landingUrl: string;
  startDate: string;
  endDate: string;
  venueName: number;
  sponsorshipDeckUrl: string;
  isActive: boolean;
  isArchived: boolean;
  isDisabled: boolean;
}

export interface IAdminSpace {
  uuid: string;
  id: number;
  spaceName: string;
  isDisabled: boolean;
}

export interface IAdminUser {
  id: number;
  name: string;
  email: string;
  isDisabled: boolean;
}

export interface IAdminUserAudits {
  id: number;
  email: string;
  status: string;
  failureReason: string;
  auditTime: string;
}
