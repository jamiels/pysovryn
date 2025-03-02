import React, { Fragment, useEffect, useRef, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { SponsorProvider, useSponsor } from '@/pages/views/sponsors/SponsorContext.tsx';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { ISponsorship, IUpdateSponsorshipRequest } from '@/services/interfaces/sponsorships.i.ts';
import { getActiveEvents } from '@/services/event_services.ts';
import { getActiveOrganizations } from '@/services/organization_services.ts';
import { updateSponsor } from '@/services/sponsorship_services.ts';

import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';
interface VenueOption {
  id: number;
  name: string;
}
const SponsorUpdateContent = () => {
  const { currentLayout } = useLayout();
  const [selectedSponsor, setSelectedSponsor] = useState<ISponsorship | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAssignedToDropdown, setShowAssignedToDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sponsor = location.state as ISponsorship;
    if (sponsor) {
      setSelectedSponsor(sponsor);
    } else {
      navigate('/sponsors');
    }
  }, [location]);

  const { fetchSponsors } = useSponsor();
  const { activeSpace } = useSpace();
  const [eventOptions, setEventOptions] = useState<VenueOption[]>([]);
  const [organizationOptions, setOrganizationOptions] = useState<VenueOption[]>([]);

  const [formData, setFormData] = useState<IUpdateSponsorshipRequest>({
    organizationId: selectedSponsor?.organizationId || 0,
    eventId: selectedSponsor?.eventId || 0,
    contactPerson: selectedSponsor?.contactPerson || '',
    contactEmailAddress: selectedSponsor?.contactEmail || '',
    invoicePerson: selectedSponsor?.invoicePerson || '',
    invoiceEmailAddress: selectedSponsor?.invoiceEmail || '',
    commitmentAmount: selectedSponsor?.commitmentAmount || '',
    deckSent: selectedSponsor?.deckSent || false,
    contractSent: selectedSponsor?.contractSent || false,
    invoiceSent: selectedSponsor?.invoiceSent || false,
    paymentReceived: selectedSponsor?.paymentReceived || false,
    space_id: 0
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAssignedToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeSpace) {
      setFormData((prev) => ({
        ...prev,
        space_id: activeSpace.id as number
      }));
    }
    if (selectedSponsor) {
      setFormData((prev) => ({
        ...prev,
        organizationId: selectedSponsor.organizationId,
        eventId: selectedSponsor.eventId,
        contactPerson: selectedSponsor.contactPerson,
        contactEmailAddress: selectedSponsor.contactEmail,
        invoicePerson: selectedSponsor.invoicePerson,
        invoiceEmailAddress: selectedSponsor.invoiceEmail,
        commitmentAmount: selectedSponsor.commitmentAmount,
        deckSent: selectedSponsor.deckSent,
        contractSent: selectedSponsor.contractSent,
        invoiceSent: selectedSponsor.invoiceSent,
        paymentReceived: selectedSponsor.paymentReceived,
        space_id: activeSpace?.id || selectedSponsor.space_id
      }));
    }
  }, [selectedSponsor, activeSpace]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setSelection = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'event_id' ? parseInt(value, 10) : value
    }));
  };

  const fetchActiveEvents = async () => {
    if (!activeSpace) return;
    const activeEvents = await getActiveEvents(activeSpace?.id as number);
    const events = activeEvents.map((event: any) => ({ id: event.id, name: event.name }));
    setEventOptions(events);
  };

  const fetchActiveOrganizations = async () => {
    if (!activeSpace) return;
    const activeOrganizations = await getActiveOrganizations(activeSpace.id as number);
    const organizations = activeOrganizations.map((organization: any) => ({
      id: organization.id,
      name: organization.name
    }));
    setOrganizationOptions(organizations);
  };

  // Fetch active events and organizations for dropdown
  useEffect(() => {
    if (activeSpace) {
      fetchActiveEvents();
      fetchActiveOrganizations();
    }
  }, [activeSpace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSponsor) return;
    const is_updated = await updateSponsor(selectedSponsor.id, formData);
    if (is_updated) {
      fetchSponsors();
      navigate(-1);
    }
  };

  return (
    <SponsorProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={`Update Sponsor`} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}
        <Container>
          <div className="py-0 mb-5 ps-0 pe-3 ">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <select
                  name="organizationId"
                  className="select  w-full"
                  value={(formData.organizationId as number).toString()}
                  onChange={(event) => setSelection('organizationId', event.target.value)}
                >
                  <option value={0} disabled>
                    Select Organization
                  </option>
                  {organizationOptions?.map((organization) => (
                    <option
                      key={`${organization.id}`}
                      value={(organization.id as number).toString()}
                    >
                      {organization.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event</label>
                <select
                  name="eventId"
                  className="select  w-full"
                  value={(formData.eventId as number).toString()}
                  onChange={(event) => setSelection('eventId', event.target.value)}
                >
                  <option value={0} disabled>
                    Select Event
                  </option>
                  {eventOptions?.map((event) => (
                    <option key={`${event.id}`} value={(event.id as number).toString()}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={'grid grid-cols-2 gap-2'}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson as string}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    name="contactEmailAddress"
                    value={formData.contactEmailAddress as string}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
              </div>
              <div className={'grid grid-cols-2 gap-2'}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Person</label>
                  <input
                    type="text"
                    name="invoicePerson"
                    value={formData.invoicePerson as string}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Email Address
                  </label>
                  <input
                    type="email"
                    name="invoiceEmailAddress"
                    value={formData.invoiceEmailAddress as string}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Commitment Amount</label>
                <input
                  type="text"
                  name="commitmentAmount"
                  value={formData.commitmentAmount as string}
                  onChange={handleInputChange}
                  className="input  w-full"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="deckSent"
                    checked={formData.deckSent as boolean}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, deckSent: e.target.checked }))
                    }
                    className="checkbox checkbox-sm"
                  />
                  <label htmlFor="deckSent" className="ml-2 text-sm font-medium text-gray-700">
                    Deck Sent
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="contractSent"
                    checked={formData.contractSent as boolean}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contractSent: e.target.checked }))
                    }
                    className="checkbox checkbox-sm"
                  />
                  <label htmlFor="contractSent" className="ml-2 text-sm font-medium text-gray-700">
                    Contract Sent
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="invoiceSent"
                    checked={formData.invoiceSent as boolean}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, invoiceSent: e.target.checked }))
                    }
                    className="checkbox checkbox-sm"
                  />
                  <label htmlFor="invoiceSent" className="ml-2 text-sm font-medium text-gray-700">
                    Invoice Sent
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="paymentReceived"
                    checked={formData.paymentReceived as boolean}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, paymentReceived: e.target.checked }))
                    }
                    className="checkbox checkbox-sm"
                  />
                  <label
                    htmlFor="paymentReceived"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Payment Received
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="submit" className="btn btn-sm btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Container>
      </Fragment>
    </SponsorProvider>
  );
};

export const UpdateSponsorPage = () => {
  return (
    <SponsorProvider>
      <SponsorUpdateContent />
    </SponsorProvider>
  );
};
