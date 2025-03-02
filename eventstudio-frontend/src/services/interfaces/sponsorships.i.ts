interface IOrganization {
  id: number;
  name: string; //should display
}

interface IEvent {
  id: number;
  name: string; //should display
}

export interface ISponsorship {
  id: number;
  organizationId: number;
  organizationName: string;
  eventId: number;
  eventName: string;
  contactPerson: string;
  contactEmail: string;
  invoicePerson: string;
  invoiceEmail: string;
  deckSent: boolean;
  contractSent: boolean;
  invoiceSent: boolean;
  paymentReceived: boolean;
  commitmentAmount: string;
  space_id: number;
  createdAt: string;
  updatedAt: string;
  assignedTo: number;
  isPrivate: boolean;
}

export interface IEventSponsorship {
  // id: number;
  // organization_id: number;
  // event_id: number;
  // contact_person: string;
  // contact_email_address: string;
  // invoice_person: string;
  // invoice_email_address: string;
  // deck_sent: boolean;
  // contract_sent: boolean;
  // invoice_sent: boolean;
  // payment_received: boolean;
  // commitment_amount: string;
  // space_id: number;
  // createdAt: string;
  // updatedAt: string;
  id: number;
  organizationId: number;
  organizationName: string;
  eventId: number;
  eventName: string;
  contactPerson: string;
  contactEmail: string;
  invoicePerson: string;
  invoiceEmail: string;
  deckSent: boolean;
  contractSent: boolean;
  invoiceSent: boolean;
  paymentReceived: boolean;
  commitmentAmount: string;
  space_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAddSponsorshipRequest {
  organizationId: number;
  eventId: number;
  contactPerson: string;
  contactEmailAddress: string;
  invoicePerson: string;
  invoiceEmailAddress: string;
  commitmentAmount: string;
  contractSent: boolean;
  invoiceSent: boolean;
  deckSent: boolean;
  paymentReceived: boolean;
  space_id: number;
  assignedTo: string; //email
  isPrivate: boolean;
}

export interface IUpdateSponsorshipRequest {
  organizationId: number | null;
  eventId: number | null;
  contactPerson: string | null;
  contactEmailAddress: string | null;
  invoicePerson: string | null;
  invoiceEmailAddress: string | null;
  commitmentAmount: string | null;
  contractSent: boolean | null;
  invoiceSent: boolean | null;
  deckSent: boolean | null;
  paymentReceived: boolean | null;
  space_id: number;
}
