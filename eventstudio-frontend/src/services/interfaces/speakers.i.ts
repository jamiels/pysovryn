export interface ISpeakers {
  id: number;
  eventId: number;
  firstName: string; //should display
  lastName: string; //should display
  emailAddress: string; //should display
  primaryAffiliation: string; //should display
  title: string; //should display
  headshot: string; //should display
  linkedInURL: string; //should display
  twitterURL: string; //should display
  bio: string; //should display
  adminFullName: string; //should display
  adminEmailAddress: string; //should display
  spaceId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IEventSpeaker {
  id: number;
  eventId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  primaryAffiliation: string;
  title: string;
  headshot: string;
  linkedInURL: string;
  twitterURL: string;
  bio: string;
  adminFullName: string;
  adminEmailAddress: string;
  spaceId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISpeakerRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  primaryAffiliation: string;
  title: string;
  headshotURL: string;
  linkedInURL: string;
  twitterURL: string;
  bio: string;
  adminFullName: string;
  adminEmailAddress: string;
  spaceId: number;
  eventId: number;
}
