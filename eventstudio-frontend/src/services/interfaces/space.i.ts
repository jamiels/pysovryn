export interface ISpaceAddRequest {
  spaceName: string;
  spaceUsers: number[];
}

export interface ISpaceUpdateRequest {
  spaceName?: string;
  spaceUsers?: number[];
}

export interface IPagePermits {
  isEventPermitted: boolean;
  isOrganizationPermitted: boolean;
  isVenuePermitted: boolean;
  isSpeakerPermitted: boolean;
  isSponsorPermitted: boolean;
}

export interface ISpace {
  uuid: string;
  id: number;
  spaceName: string;
  spaceUserIDs: number[];
  spaceUsers: string[];
  isAdmin: boolean;
  invitedUsers: {
    email: string;
    isVerified: boolean;
  }[];
  pagePermits: IPagePermits;
}

export interface IAddSpaceUserRequest {
  email: string;
  name?: string;
}

export interface IRemoveSpaceUserRequest {
  email: string;
  spaceId: number;
}

export interface IEmailInvite {
  email: string;
  spaceId: number;
}
