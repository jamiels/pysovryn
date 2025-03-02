import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { EventProvider, useEvents } from '@/pages/views/events/EventContext.tsx';

import { IEvent, IEventRequest } from '@/services/interfaces/event.i.ts';
import { useLocation } from 'react-router-dom';

import { useSpace } from '@/contexts/SpaceContext.tsx';
import { getAuth } from '@/auth';
import { getTimeFromDate, timezones } from '@/utils/Date.ts';
import {
  getEventById,
  getEventInitData,
  updateEvent,
  uploadEventBanner
} from '@/services/event_services.ts';
import { useNavigate } from 'react-router';
import { FixedSizeList as List } from 'react-window';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';
import { showToast } from '@/utils/toast_helper.ts';
import CropModal from '@/components/CropModel.tsx';
import { getCroppedImg, validateImageFile } from '@/utils/crop-image.ts';
import { toAbsoluteUrl } from '@/utils';
import { KeenIcon } from '@/components';

interface VenueOption {
  id: number;
  name: string;
}

const EventUpdatePage = () => {
  return (
    <EventProvider>
      <EventUpdate />
    </EventProvider>
  );
};

const EventUpdate = () => {
  const { currentLayout } = useLayout();
  const location = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [timezoneQuery, setTimezoneQuery] = useState('');
  const [venueOptions, setVenueOptions] = useState<VenueOption[]>([]);
  const [formData, setFormData] = useState<IEventRequest | null>(null);
  const { fetchEvents } = useEvents();
  const { activeSpace } = useSpace();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (location.state) {
      const event = location.state.event as IEvent;
      setSelectedEvent(event);
    }
  }, [location]);

  useEffect(() => {
    if (selectedEvent) {
      const tz = timezones.find((t) => t.value === selectedEvent.timezone);
      setTimezoneQuery(tz ? tz.label : '');

      setFormData({
        id: selectedEvent.id,
        userId: getAuth()?.user.userId as number,
        name: selectedEvent.name,
        shortName: selectedEvent.shortName,
        landingUrl: selectedEvent.landingUrl,
        startdate: selectedEvent.startDate ? selectedEvent.startDate.split('T')[0] : '',
        enddate: selectedEvent.endDate ? selectedEvent.endDate.split('T')[0] : '',
        veneue: selectedEvent?.venueId || 0,
        theme: selectedEvent.theme,
        sponsorshipDeckUrl: selectedEvent.sponsorshipDeckUrl,
        space_id: activeSpace?.id || 0,
        isActive: selectedEvent?.isActive,
        timezone: selectedEvent.timezone,
        luma: selectedEvent.luma,
        meetup: selectedEvent.meetup,
        eventBrite: selectedEvent.eventBrite,
        starttime: selectedEvent?.startDate ? getTimeFromDate(selectedEvent.startDate) : '00:00',
        endtime: selectedEvent?.endDate ? getTimeFromDate(selectedEvent.endDate) : '23:59'
      });
    }
  }, [selectedEvent]);

  const filteredTimezones = timezones.filter((tz) =>
    tz.label.toLowerCase().includes(timezoneQuery.toLowerCase())
  );

  const handleBannerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] || !selectedEvent) return;

    const file = event.target.files[0];
    const tempUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setSelectedImage(tempUrl);
    setCropModalOpen(true);
    setBanner(tempUrl);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimezoneDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !selectedEvent) return;

    // Combine date and time inputs into datetime strings
    const startDateTime = new Date(`${formData.startdate}T${formData.starttime}`);
    const endDateTime = new Date(`${formData.enddate}T${formData.endtime}`);

    // Validate datetime inputs
    if (isNaN(startDateTime.getTime())) {
      showToast('error', 'Invalid start date/time combination');
      return;
    }
    if (isNaN(endDateTime.getTime())) {
      showToast('error', 'Invalid end date/time combination');
      return;
    }

    // Check date ordering
    if (startDateTime >= endDateTime) {
      showToast('error', 'Start date/time must be before end date/time');
      return;
    }

    // Create updated data with combined datetimes
    const updatedData = {
      ...formData,
      startdate: startDateTime.toISOString(),
      enddate: endDateTime.toISOString()
    };

    // Identify changed fields
    const updatedFields = Object.keys(updatedData).reduce(
      (changes: Partial<IEventRequest>, key) => {
        if (updatedData[key as keyof IEventRequest] !== selectedEvent[key as keyof IEvent]) {
          (changes as any)[key] = updatedData[key as keyof IEventRequest];
        }
        return changes;
      },
      {}
    );

    // Check if there are any changes to send
    if (Object.keys(updatedFields).length > 0) {
      updatedFields.isActive = formData.isActive;
      try {
        const is_success = await updateEvent(selectedEvent.id, updatedFields);
        if (is_success) {
          fetchEvents();
          navigate(-1);
        }
      } catch (error) {
        console.error('Failed to update event:', error);
      }
    }
  };

  const onCropComplete = useCallback(
    async (croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      if (!selectedImage || !selectedEvent) return;
      try {
        // Generate the cropped image blob
        const is_valid_image = validateImageFile(selectedFile as File);
        if (!is_valid_image) {
          showToast('error', 'Invalid image file. Must be a maximum of 10MB Image');
          return;
        }
        const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);
        // Convert blob to file
        const croppedFile = new File([croppedBlob as Blob], 'banner.jpeg', {
          type: 'image/jpeg'
        });
        setIsUploading(true);
        // Upload the cropped file
        const is_success = await uploadEventBanner(selectedEvent.id, croppedFile);
        setIsUploading(false);
        if (is_success) {
          const eventDetails = await getEventById(selectedEvent.id);
          setSelectedEvent(eventDetails);
        }
      } catch (error) {
        console.error('Error cropping/uploading banner:', error);
      } finally {
        setIsUploading(false);
        setBanner(null);
        setSelectedImage(null);
        setCropModalOpen(false);
      }
    },
    [selectedImage, selectedEvent]
  );

  const fetchVenues = async () => {
    const venues = await getEventInitData(activeSpace?.id as number);

    setVenueOptions(
      Object.entries(venues).map(([id, name]) => ({ id: Number(id), name: name as string }))
    );
  };

  useEffect(() => {
    if (activeSpace) {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          space_id: activeSpace.id
        };
      });

      fetchVenues();
    }
  }, [activeSpace]);

  if (!formData) return null;

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={selectedEvent?.name} />
              <ToolbarDescription>Update Event Details</ToolbarDescription>
              <BreadCrumb />
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className={'gap-4 flex flex-col'}>
          <div
            className="md:h-54 bg-cover border bg-no-repeat card-rounded-t flex items-center justify-center shrink-0 relative"
            style={{
              aspectRatio: '8/1',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url('${
                banner
                  ? toAbsoluteUrl(banner)
                  : selectedEvent?.banner
                    ? toAbsoluteUrl(selectedEvent.banner)
                    : toAbsoluteUrl('/media/auth_bg.jpg')
              }')`,

              width: '100%',
              height: 'auto'
            }}
          >
            <div className="absolute top-4 right-4 ">
              {/* Hidden file input */}
              <input
                type="file"
                id="banner-upload"
                accept="image/*"
                className="opacity-0 absolute w-0 h-0"
                onChange={handleBannerChange}
              />

              <div className="relative group">
                <label
                  htmlFor="banner-upload"
                  className="btn btn-icon btn-secondary rounded-lg btn-xs cursor-pointer shadow-sm"
                >
                  <KeenIcon icon={'plus'} />
                </label>

                {/* Tooltip - Slides in on hover */}
                <div className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-nowrap -mt-6">
                  Change Banner
                </div>
              </div>
            </div>
          </div>
          <div className={'card '}>
            <div className="card-header">
              <h1 className="text-md font-semibold text-gray-900">Update Event</h1>
            </div>
            <div className={'card-body'}>
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Event</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Short Name</label>
                      <input
                        type="text"
                        name="shortName"
                        value={formData.shortName}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Theme</label>
                    <input
                      type="text"
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      className="input  w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Landing URL</label>
                      <input
                        type="text"
                        name="landingUrl"
                        value={formData.landingUrl}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sponsorship deck URL
                      </label>
                      <input
                        type="text"
                        name="sponsorshipDeckUrl"
                        value={formData.sponsorshipDeckUrl}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meetup RSVP</label>
                      <input
                        type="text"
                        name="meetup"
                        value={formData.meetup}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Luma RSVP</label>
                      <input
                        type="text"
                        name="luma"
                        value={formData.luma}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Event Brite RSVP
                      </label>
                      <input
                        type="text"
                        name="eventBrite"
                        value={formData.eventBrite}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startdate"
                        value={formData.startdate}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="enddate"
                        value={formData.enddate}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Time</label>
                      <input
                        type="time"
                        name="starttime"
                        value={formData.starttime}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Time</label>
                      <input
                        type="time"
                        name="endtime"
                        value={formData.endtime}
                        onChange={handleInputChange}
                        className="input  w-full"
                      />
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <label className="block text-sm font-medium text-gray-700">Timezone</label>
                      <input
                        type="text"
                        value={timezoneQuery}
                        onChange={(e) => {
                          setTimezoneQuery(e.target.value);
                          setShowTimezoneDropdown(true);
                        }}
                        onFocus={() => setShowTimezoneDropdown(true)}
                        placeholder="Search timezone..."
                        className="input  w-full"
                      />
                      {showTimezoneDropdown && filteredTimezones.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full ">
                          <List
                            height={5 * 40}
                            itemCount={filteredTimezones.length}
                            itemSize={40}
                            width="100%"
                            className={
                              'bg-white dark:bg-dark border border-gray-200 rounded-md shadow-md text-xs z-10  '
                            }
                          >
                            {({ index, style }: { index: number; style: React.CSSProperties }) => {
                              const tz = filteredTimezones[index];
                              return (
                                <div
                                  key={tz.value}
                                  style={style}
                                  className="cursor-pointer select-none p-2 hover:bg-gray-100"
                                  onClick={() => {
                                    setFormData((prev) =>
                                      prev ? { ...prev, timezone: tz.value } : prev
                                    );
                                    setTimezoneQuery(tz.label);
                                    setShowTimezoneDropdown(false);
                                  }}
                                >
                                  {tz.label}
                                </div>
                              );
                            }}
                          </List>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Venue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Venue</label>
                    <select
                      name="veneue"
                      className="select w-full"
                      value={formData.veneue}
                      onChange={handleInputChange}
                    >
                      <option value={0} disabled>
                        {selectedEvent?.venueName ? selectedEvent?.venueName : 'Select Venue'}
                      </option>
                      {venueOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="submit" className="btn btn-sm btn-primary">
                      Submit
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
        </div>
      </Container>

      {cropModalOpen && selectedImage && (
        <CropModal
          imageSrc={selectedImage}
          onCancel={() => {
            setCropModalOpen(false);
            setSelectedImage(null);
          }}
          onCropComplete={onCropComplete}
        />
      )}
    </Fragment>
  );
};

export { EventUpdatePage };
