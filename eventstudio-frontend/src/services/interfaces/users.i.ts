export interface IUser {
  id: number;
  name: string;
  email: string;
  pagePermissions: {
    isEventPermitted: boolean;
    isOrganizationPermitted: boolean;
    isSponsorPermitted: boolean;
    isVenuePermitted: boolean;
    isSpeakerPermitted: boolean;
  };
}

export interface IUpdateUser {
  name?: string;
  // email?: string;
  password?: string;
  isEventPermitted: boolean;
  isOrganizationPermitted: boolean;
  isSponsorPermitted: boolean;
  isVenuePermitted: boolean;
  isSpeakerPermitted: boolean;
}

export interface IChangePassword {
  oldpassword: string;
  newpassword: string;
  name: string;
}

export interface IUserAccessRequest {
  userId: number;
  spaceId: number;
  isEventPermitted: boolean;
  isOrganizationPermitted: boolean;
  isSponsorPermitted: boolean;
  isVenuePermitted: boolean;
  isSpeakerPermitted: boolean;
}
