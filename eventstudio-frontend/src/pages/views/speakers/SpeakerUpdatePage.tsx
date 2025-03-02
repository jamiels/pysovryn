import React, { Fragment, useEffect, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { SpeakerProvider, useSpeaker } from '@/pages/views/speakers/SpeakerContext.tsx';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { ISpeakerRequest, ISpeakers } from '@/services/interfaces/speakers.i.ts';
import { getActiveEvents } from '@/services/event_services.ts';
import { updateSpeaker } from '@/services/speakers_service.ts';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { getActiveOrganizations } from '@/services/organization_services.ts';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

interface VenueOption {
  id: number;
  name: string;
}

const initialFormData: ISpeakerRequest = {
  firstName: '',
  lastName: '',
  emailAddress: '',
  primaryAffiliation: '',
  title: '',
  headshotURL: '',
  linkedInURL: '',
  twitterURL: '',
  bio: '',
  adminFullName: '',
  adminEmailAddress: '',
  spaceId: 0,
  eventId: 0
};

const SpeakerUpdateContent = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setSelectedSpeaker(location.state.speaker);
    }
  }, [location]);

  const [selectedSpeaker, setSelectedSpeaker] = useState<ISpeakers | null>(null);

  const { fetchSpeakers } = useSpeaker();
  const [eventOptions, setEventOptions] = useState<VenueOption[]>([]);
  const { activeSpace } = useSpace();
  const [organizerOptions, setOrganizerOptions] = useState<VenueOption[]>([]);
  const [headshot, setHeadshot] = useState<File | null>(null); // State for the file

  const [formData, setFormData] = useState<ISpeakerRequest>(initialFormData);

  useEffect(() => {
    if (selectedSpeaker) {
      setFormData({
        firstName: selectedSpeaker.firstName || '',
        lastName: selectedSpeaker.lastName || '',
        emailAddress: selectedSpeaker.emailAddress || '',
        primaryAffiliation: selectedSpeaker.primaryAffiliation || '',
        title: selectedSpeaker.title || '',
        headshotURL: selectedSpeaker.headshot || '',
        linkedInURL: selectedSpeaker.linkedInURL || '',
        twitterURL: selectedSpeaker.twitterURL || '',
        bio: selectedSpeaker.bio || '',
        adminFullName: selectedSpeaker.adminFullName || '',
        adminEmailAddress: selectedSpeaker.adminEmailAddress || '',
        spaceId: selectedSpeaker.spaceId || 0,
        eventId: selectedSpeaker.eventId || 0
      });
    }
  }, [selectedSpeaker]);

  const fetchActiveEvents = async () => {
    const activeEvents = await getActiveEvents(activeSpace?.id as number);
    const events = activeEvents.map((event: any) => ({ id: event.id, name: event.name }));
    setEventOptions(events);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setHeadshot(file || null);
  };

  const fetchOrganizers = async () => {
    const organizers = await getActiveOrganizations(activeSpace?.id as number);

    const orgs = organizers.map((org: any) => ({ id: org.id, name: org.name }));
    setOrganizerOptions(orgs);
  };

  // Fetch active events for dropdown
  useEffect(() => {
    if (activeSpace) {
      setFormData((prev) => ({
        ...prev,
        spaceId: activeSpace.id as number
      }));
      fetchActiveEvents();
      fetchOrganizers();
    }
  }, [activeSpace]);

  const setSelection = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'eventId' ? parseInt(value, 10) : value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSpeaker) return;

    const isUpdated = await updateSpeaker(selectedSpeaker?.id, formData, headshot);
    if (isUpdated) {
      fetchSpeakers();
      navigate(-1);
    }
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle
                text={`Update Speaker Details: ${selectedSpeaker?.firstName} ${selectedSpeaker?.lastName}`}
              />
              <ToolbarDescription>
                <BreadCrumb />
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className={'card'}>
          <div className={'card-header'}>
            <p className={'text-md font-semibold'}>Speaker Details</p>
          </div>
          <div className={'card-body'}>
            <div>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event</label>
                  <select
                    name="eventId"
                    className="select  w-full"
                    value={formData.eventId}
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
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                </div>
                <div className={'grid grid-cols-2 gap-2'}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Primary Affiliation
                    </label>
                    {/*<input*/}
                    {/*  type="text"*/}
                    {/*  name="primaryAffiliation"*/}
                    {/*  value={formData.primaryAffiliation}*/}
                    {/*  onChange={handleInputChange}*/}
                    {/*  className="input  w-full"*/}
                    {/*/>*/}
                    <select
                      name="primaryAffiliation"
                      className="select  w-full"
                      value={formData.primaryAffiliation}
                      onChange={(event) => setSelection('primaryAffiliation', event.target.value)}
                    >
                      <option value={0} disabled>
                        Select Primary Affiliation
                      </option>
                      {organizerOptions?.map((org) => (
                        <option key={`${org.id}`} value={org.name.toString()}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={'grid grid-cols-2 gap-2'}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                  {/*<div>*/}
                  {/*  <label className="block text-sm font-medium text-gray-700">Headshot</label>*/}
                  {/*  <input*/}
                  {/*    type="text"*/}
                  {/*    name="headshotURL"*/}
                  {/*    value={formData.headshotURL}*/}
                  {/*    onChange={handleInputChange}*/}
                  {/*    className="input  w-full"*/}
                  {/*  />*/}
                  {/*</div>*/}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Head Shot</label>
                    <input
                      type="file"
                      name="headshot"
                      onChange={handleFileChange}
                      className="input w-full"
                    />
                  </div>
                </div>
                <div className={'grid grid-cols-2 gap-2'}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                    <input
                      type="text"
                      name="linkedInURL"
                      value={formData.linkedInURL}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
                    <input
                      type="text"
                      name="twitterURL"
                      value={formData.twitterURL}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                </div>
                <div className={'grid grid-cols-2 gap-2'}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Admin Full Name
                    </label>
                    <input
                      type="text"
                      name="adminFullName"
                      value={formData.adminFullName}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                    <input
                      type="text"
                      name="adminEmailAddress"
                      value={formData.adminEmailAddress}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
                    }
                    className="textarea textarea-sm w-full"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="submit" className="btn btn-sm btn-primary">
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline btn-secondary"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export const SpeakerUpdatePage = () => {
  return (
    <SpeakerProvider>
      <SpeakerUpdateContent />
    </SpeakerProvider>
  );
};
