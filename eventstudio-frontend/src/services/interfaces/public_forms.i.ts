import { bool } from 'yup';

export interface IPublicSponsorRequest {
  name: string;
  email: string;
  involvement: string;
  linkedIn: string;
  eventUUID: string;
  captchaToken: string;
  // spaceUUID: string;
}

export interface IPublicOnboardSpeakerRequest {
  fullName: string;
  email: string;
  bio: string;
  linkedInURL: string;
  twitterURL: string;
  title: string;
  organization: string;
  eventUUID: string;
  headshotURL: string;
  captchaToken: string;
}

export interface IPublicSpeakerRequest {
  fullName: string;
  email: string;
  abstract: string;
  linkedInURL: string;
  organization: string;
  panelists: boolean;
  sponsorshipInterest: string;
  title: string;
  eventUUID: string;
  captchaToken: string;
}

export interface IPublicVolunteerRequest {
  fullName: string;
  email: string;
  linkedInURL: string;
  mobilePhone: string;
  telegramID: string;
  communicationTools: string[];
  areasOfSupport: string[];
  businessAttire: boolean;
  eventUUID: string;
  captchaToken: string;
}

export interface IPublicSponsor {
  id: number;
  eventUUID: string;
  spaceUUID: string;
  name: string;
  email: string;
  involvement: string;
  linkedIn: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPublicSpeaker {
  id: number;
  eventUUID: string;
  spaceUUID: string | null;
  fullName: string;
  email: string;
  organization: string;
  eventName: string;
  title: string;
  panelists: boolean;
  abstractText: string;
  linkedInURL: string;
  sponsorshipInterest: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPublicOnboard {
  id: number;
  eventUUID: string;
  spaceUUID: string | null;
  fullName: string;
  email: string;
  bio: string;
  eventName: string;
  linkedInURL: string;
  twitterURL: string;
  headshotURL: string;
  title: string;
  organization: string;
  createdAt: string;
  updatedAt: string;
}
