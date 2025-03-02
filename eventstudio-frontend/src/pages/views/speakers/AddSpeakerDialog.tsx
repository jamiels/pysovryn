import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';

import { useSpeaker } from '@/pages/views/speakers/SpeakerContext.tsx';

import { getActiveEvents } from '@/services/event_services.ts';
import { ISpeakerRequest } from '@/services/interfaces/speakers.i.ts';
import { addSpeaker } from '@/services/speakers_service.ts';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { useNavigate } from 'react-router';

interface AddSpeakerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const AddSpeakerDialog: React.FC<AddSpeakerDialogProps> = ({ isOpen, onClose }) => {
  const { fetchSpeakers } = useSpeaker();
  const [eventOptions, setEventOptions] = useState<VenueOption[]>([]);
  const [navigatingPage, setNavigatingPage] = useState<'update' | 'speaker'>('update');
  const navigate = useNavigate();
  const { activeSpace } = useSpace();
  const [headshot, setHeadshot] = useState<File | null>(null); // State for the file
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ISpeakerRequest>(initialFormData);
  const handleSetNavigatingPage = (page: 'update' | 'speaker') => {
    setNavigatingPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setHeadshot(file || null);
  };

  const setSelection = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'eventId' ? parseInt(value, 10) : value
    }));
  };

  const fetchActiveEvents = async () => {
    if (!activeSpace) return;
    const activeEvents = await getActiveEvents(activeSpace?.id as number);
    const events = activeEvents.map((event: any) => ({ id: event.id, name: event.name }));
    setEventOptions(events);
  };

  // Fetch active events for dropdown
  useEffect(() => {
    if (activeSpace) {
      setFormData((prev) => ({ ...prev, spaceId: activeSpace?.id as number }));
      fetchActiveEvents();
    }
  }, [activeSpace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const added_speaker = await addSpeaker(formData, headshot);
    setLoading(false);
    if (added_speaker?.id) {
      fetchSpeakers();
      onClose();
      if (navigatingPage === 'speaker') {
        navigate('/speakers/');
      }
      if (navigatingPage === 'update') {
        navigate('/speakers/update-speaker', { state: { speaker: added_speaker } });
      }
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} className="!flex ">
      <ModalContent
        className="container-fixed px-6 sm:px-10 md:px-20 overflow-hidden pt-2 my-[3%] h-[95%] max-h-[50%]
                   w-[95%] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl dark:border-gray-50/20 dark:border"
      >
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 pt-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none flex flex-row text-gray-900 items-center gap-2">
                <p>New Speaker</p>
              </h1>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Event</label>
              <select
                name="eventId"
                className="select w-full"
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
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input  w-full"
                  placeholder="Enter first name"
                  required
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
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            {/*<div className={'grid grid-cols-2 gap-2'}>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">Email Address</label>*/}
            {/*    <input*/}
            {/*      type="email"*/}
            {/*      name="emailAddress"*/}
            {/*      value={formData.emailAddress}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="newspeaker@example.com"*/}
            {/*      required*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">*/}
            {/*      Primary Affiliation*/}
            {/*    </label>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      name="primaryAffiliation"*/}
            {/*      value={formData.primaryAffiliation}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="Enter primary affiliation"*/}
            {/*      required*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className={'grid grid-cols-2 gap-2'}>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">Title</label>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      name="title"*/}
            {/*      value={formData.title}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="Enter title"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">Headshot</label>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      name="headshotURL"*/}
            {/*      value={formData.headshotURL}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="Enter headshotURL"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className={'grid grid-cols-2 gap-2'}>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      name="linkedInURL"*/}
            {/*      value={formData.linkedInURL}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="Enter LinkedIn URL"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">Twitter URL</label>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      name="twitterURL"*/}
            {/*      value={formData.twitterURL}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="Enter Twitter URL"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className={'grid grid-cols-2 gap-2'}>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">Admin Full Name</label>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      name="adminFullName"*/}
            {/*      value={formData.adminFullName}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="Admin Full Name"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*  <div>*/}
            {/*    <label className="block text-sm font-medium text-gray-700">Admin Email</label>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      name="adminEmailAddress"*/}
            {/*      value={formData.adminEmailAddress}*/}
            {/*      onChange={handleInputChange}*/}
            {/*      className="input  w-full"*/}
            {/*      placeholder="Enter Admin Email"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <label className="block text-sm font-medium text-gray-700">Bio</label>*/}
            {/*  <textarea*/}
            {/*    name="bio"*/}
            {/*    value={formData.bio}*/}
            {/*    onChange={(e) =>*/}
            {/*      handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)*/}
            {/*    }*/}
            {/*    className="textarea textarea-sm w-full"*/}
            {/*    placeholder="Enter bio"*/}
            {/*  />*/}
            {/*</div>*/}

            {/*<div>*/}
            {/*  <label className="block text-sm font-medium text-gray-700">Head Shot</label>*/}
            {/*  <input*/}
            {/*      type="file"*/}
            {/*      name="headshotURL"*/}
            {/*      onChange={handleFileChange}*/}
            {/*      className="input w-full"*/}
            {/*  />*/}
            {/*</div>*/}
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className={`btn btn-sm btn-primary ${loading && navigatingPage === 'speaker' ? 'cursor-not-allowed disabled' : ''}`}
                onClick={() => handleSetNavigatingPage('speaker')}
              >
                {loading && navigatingPage === 'speaker' ? 'Creating...' : 'Submit'}
              </button>
              <button
                type="submit"
                className={`btn btn-sm btn-primary ${loading && navigatingPage === 'update' ? 'cursor-not-allowed disabled' : ''}`}
                onClick={() => handleSetNavigatingPage('update')}
              >
                {loading && navigatingPage === 'update' ? 'Creating...' : 'Submit & Update'}
              </button>{' '}
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
