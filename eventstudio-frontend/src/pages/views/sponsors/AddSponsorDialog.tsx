import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { getActiveEvents } from '@/services/event_services.ts';

import { IAddSponsorshipRequest } from '@/services/interfaces/sponsorships.i.ts';
import { getActiveOrganizations } from '@/services/organization_services.ts';
import { useSponsor } from '@/pages/views/sponsors/SponsorContext.tsx';
import { addSponsor } from '@/services/sponsorship_services.ts';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { useNavigate } from 'react-router';
import { FixedSizeList as List } from 'react-window';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

interface AddSponsorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VenueOption {
  id: number;
  name: string;
}

const initialFormData: IAddSponsorshipRequest = {
  organizationId: 0,
  eventId: 0,
  space_id: 0,
  contactPerson: '',
  contactEmailAddress: '',
  invoicePerson: '',
  invoiceEmailAddress: '',
  commitmentAmount: '0',
  contractSent: false,
  invoiceSent: false,
  deckSent: false,
  paymentReceived: false,
  assignedTo: '',
  isPrivate: true
};

export const AddSponsorDialog: React.FC<AddSponsorDialogProps> = ({ isOpen, onClose }) => {
  const { fetchSponsors } = useSponsor();
  const [eventOptions, setEventOptions] = useState<VenueOption[]>([]);
  const [organizationOptions, setOrganizationOptions] = useState<VenueOption[]>([]);
  const [navigatingPage, setNavigatingPage] = useState<'update' | 'sponsor'>('update');
  const [formData, setFormData] = useState<IAddSponsorshipRequest>(initialFormData);
  const { activeSpace } = useSpace();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAssignedToDropdown, setShowAssignedToDropdown] = useState(false);
  const { auth } = useAuth();
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
    const activeOrganizations = await getActiveOrganizations(activeSpace?.id as number);
    const organizations = activeOrganizations.map((organization: any) => ({
      id: organization.id,
      name: organization.name
    }));
    setOrganizationOptions(organizations);
  };

  // Fetch active events and organizations for dropdown
  useEffect(() => {
    if (activeSpace) {
      setFormData((prev) => ({
        ...prev,
        space_id: activeSpace.id as number,
        assignedTo: auth?.user?.email || ''
      }));
      fetchActiveEvents();
      fetchActiveOrganizations();
    }
  }, [activeSpace, auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.organizationId || !formData.eventId || !formData.space_id) return;

    const added_sponsor = await addSponsor(formData);
    if (added_sponsor?.id) {
      fetchSponsors();
      onClose();
      setFormData(
        (prev) =>
          ({
            ...prev,
            organizationId: 0,
            eventId: 0,
            contactPerson: '',
            contactEmailAddress: '',
            invoicePerson: '',
            invoiceEmailAddress: '',
            commitmentAmount: '0',
            contractSent: false,
            invoiceSent: false,
            deckSent: false,
            paymentReceived: false
          }) as IAddSponsorshipRequest
      );
      if (navigatingPage === 'update') {
        // Navigate to the sponsor page
        navigate(`/sponsorships/update-sponsor`, { state: added_sponsor });
      }

      if (navigatingPage === 'sponsor') {
        // Navigate to the sponsor page
        navigate(`/sponsorships/`);
      }
    }
  };

  const handleSetNavigatingPage = (page: 'update' | 'sponsor') => {
    setNavigatingPage(page);
  };

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

  return (
    <Modal open={isOpen} onClose={onClose} className="!flex justify-center items-center">
      <ModalContent
        className=" px-6 sm:px-10 md:px-20 overflow-hidden pt-2 my-[3%] max-h-screen
                   w-[95%] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl dark:border-gray-50/20 dark:border"
      >
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 pt-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none flex flex-row text-gray-900 items-center gap-2">
                <p>Sponsor</p>
              </h1>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <select
                name="organizationId"
                className="select  w-full"
                value={formData.organizationId}
                required
                onChange={(event) => setSelection('organizationId', event.target.value)}
              >
                <option value={0} disabled>
                  Select Organization
                </option>
                {organizationOptions?.map((organization) => (
                  <option key={`${organization.id}`} value={organization.id.toString()}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, assignedTo: e.target.value }));
                  setShowAssignedToDropdown(true);
                }}
                onFocus={() => setShowAssignedToDropdown(true)}
                placeholder="Search users..."
                className="input  w-full"
              />
              {showAssignedToDropdown && (activeSpace?.spaceUsers?.length ?? 0) > 0 && (
                <div className="absolute z-50 mt-1 w-full ">
                  <List
                    height={5 * 40}
                    itemCount={activeSpace?.spaceUsers.length || 0}
                    itemSize={40}
                    width="100%"
                    className={
                      'bg-white dark:bg-dark border border-gray-200 rounded-md shadow-md text-xs z-10  '
                    }
                  >
                    {({ index, style }: { index: number; style: React.CSSProperties }) => {
                      const user = activeSpace?.spaceUsers[index];
                      return (
                        <div
                          key={index}
                          style={style}
                          className="cursor-pointer select-none p-2 hover:bg-gray-100"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              assignedTo: user?.toString() || ''
                            }));
                            setShowAssignedToDropdown(false);
                          }}
                        >
                          {user?.toString()}
                        </div>
                      );
                    }}
                  </List>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Event</label>
              <select
                name="eventId"
                className="select  w-full"
                value={formData.eventId}
                required
                onChange={(event) => setSelection('eventId', event.target.value)}
              >
                <option value={0} disabled>
                  Select Event
                </option>
                {eventOptions?.map((event) => (
                  <option key={`${event.id}`} value={event.id.toString()}>
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
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="input  w-full"
                  placeholder="Enter Contact Person"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  name="contactEmailAddress"
                  value={formData.contactEmailAddress}
                  onChange={handleInputChange}
                  className="input  w-full"
                  placeholder="Enter Contact Email Address"
                />
              </div>
            </div>

            <div className={'flex flex-row gap-2 items-center'}>
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => setFormData((prev) => ({ ...prev, isPrivate: e.target.checked }))}
                className="checkbox checkbox-sm  w-full"
              />
              <label className="block text-sm font-medium text-gray-700">Is Private</label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                onClick={() => handleSetNavigatingPage('sponsor')}
              >
                Submit
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                onClick={() => handleSetNavigatingPage('update')}
              >
                Submit & Update
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
