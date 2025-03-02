export interface IVolunteer {
  id: number;
  eventUUID: string;
  spaceUUID: string | null;
  fullName: string; //should display in table
  email: string; //should display in table
  mobilePhone: string; //should display in table
  communicationTools: string[]; //should display in table
  telegramID: string; //should display in table
  linkedInURL: string; //should display in table
  areasOfSupport: string[]; //should display in table (list down)
  businessAttire: boolean; //should display in table
  createdAt: string;
  updatedAt: string;
}
