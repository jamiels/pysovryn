export interface IOrganization {
  id: number;
  name: string;
  space_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrganizationRequest {
  name: string;
  space_id: number;
}

export interface IOrganizationUpdateRequest {
  name: string;
  space_id: number;
}
