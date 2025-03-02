import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { EventProvider } from '@/pages/views/events/EventContext.tsx';
import { IEventSpeaker } from '@/services/interfaces/speakers.i.ts';
import { IEventSponsorship } from '@/services/interfaces/sponsorships.i.ts';
import { deleteSponsor, getEventSponsorships } from '@/services/sponsorship_services.ts';
import { deleteSpeaker, getSpeakersForEvent } from '@/services/speakers_service.ts';
import { ColumnDef } from '@tanstack/react-table';
import LinkedInIcon from '@/media/social/linkedin.svg';
import { DataGrid, KeenIcon } from '@/components';
import { IEvent } from '@/services/interfaces/event.i.ts';
import { DeleteSpeakerDialog } from '@/pages/views/speakers/speaker-table/Speakers.tsx';
import { DeleteSponsorDialog } from '@/pages/views/sponsors/sponsor-table/Sponsors.tsx';

import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ToolbarActions } from '@/layouts/demo1/toolbar';
import { toAbsoluteUrl } from '@/utils';
import { getEventById, updateEvent, uploadEventBanner } from '@/services/event_services.ts';
import { showToast } from '@/utils/toast_helper.ts';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';
import { formatIsoDate } from '@/utils/Date.ts';
import { getCroppedImg, validateImageFile } from '@/utils/crop-image.ts';
import CropModal from '@/components/CropModel.tsx';

interface IUpdateEvent {
  meetup?: string;
  luma?: string;
  eventBrite?: string;
}

const EventDetailsPage = () => {
  const frontendURL = import.meta.env.VITE_APP_FRONTEND_URL as string;
  const { currentLayout } = useLayout();
  const [isUploading, setIsUploading] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<IEventSpeaker[]>([]);
  const [sponsors, setSponsors] = useState<IEventSponsorship[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteSpeakerDialogOpen, setIsDeleteSpeakerDialogOpen] = useState(false);
  const [isDeleteSponsorDialogOpen, setIsDeleteSponsorDialogOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<IEventSpeaker | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<IEventSponsorship | null>(null);
  const location = useLocation();
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<'eventBrite' | 'meetup' | 'luma' | null>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<IUpdateEvent>({
    meetup: '',
    luma: '',
    eventBrite: ''
  });

  //update event
  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    // Create payload with only changed fields
    const payload: Partial<Record<keyof IUpdateEvent, string | null>> = {};
    (Object.keys(formData) as (keyof IUpdateEvent)[]).forEach((key) => {
      const formValue = formData[key];
      const originalValue = selectedEvent[key];

      // Compare values, treating empty string as null
      if (formValue !== originalValue) {
        payload[key] = formValue === '' ? null : formValue;
      }
    });

    if (Object.keys(payload).length === 0) {
      showToast('error', 'No changes to save');
      setEditingField(null);
      return;
    }

    try {
      const is_updated: boolean = await updateEvent(selectedEvent.id, payload);
      if (is_updated) {
        // Merge the payload into the existing selectedEvent state
        setSelectedEvent((prevEvent) =>
          prevEvent
            ? {
                ...prevEvent,
                ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, v ?? undefined]))
              }
            : prevEvent
        );
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
    setEditingField(null);
  };

  const handleCancelEdit = (field: keyof IUpdateEvent) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedEvent?.[field] || ''
    }));
    setEditingField(null);
  };

  const renderEditableField = (field: keyof IUpdateEvent, label: string) => {
    const isEditing = editingField === field;
    const value = selectedEvent?.[field] || '';

    return (
      <div className="px-4 py-2 border-b text-xs flex items-center">
        {/* Left: Label */}
        <div className="flex-1 text-left">
          <p>{label}</p>
        </div>

        {/* Center: Value or Input */}
        <div className="flex-1 text-center">
          {isEditing ? (
            <input
              type="text"
              value={formData[field] || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
              className="input input-sm w-full"
              autoFocus
            />
          ) : (
            value || (
              <div className="badge-warning badge-outline p-1 rounded-lg border text-xs">
                Not Set
              </div>
            )
          )}
        </div>

        {/* Right: Buttons */}
        <div className="flex-1 text-right">
          {isEditing ? (
            <div className="flex items-center justify-end gap-2">
              <button className="btn btn-outline btn-xs btn-success" onClick={handleUpdateEvent}>
                <KeenIcon icon="check" />
              </button>
              <button
                className="btn btn-xs btn-danger btn-outline"
                onClick={() => handleCancelEdit(field)}
              >
                <KeenIcon icon="cross" />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-xs btn-outline btn-secondary"
              onClick={() => setEditingField(field)}
            >
              <KeenIcon icon="pencil" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const openDeleteSpeakerDialog = (speaker: IEventSpeaker) => {
    setSelectedSpeaker(speaker);
    setIsDeleteSpeakerDialogOpen(true);
  };

  const closeDeleteSpeakerDialog = () => {
    setIsDeleteSpeakerDialogOpen(false);
  };

  const openDeleteSponsorDialog = (sponsorship: IEventSponsorship) => {
    setSelectedSponsor(sponsorship);
    setIsDeleteSponsorDialogOpen(true);
  };

  const closeDeleteSponsorDialog = () => {
    setIsDeleteSponsorDialogOpen(false);
  };

  const handleDeleteSponsor = async () => {
    const is_deleted: boolean = await deleteSponsor(selectedSponsor?.id);
    if (is_deleted) {
      closeDeleteSponsorDialog();
      const updatedSpeakers = speakers.filter((speaker) => speaker.id !== selectedSpeaker?.id);
      setSpeakers(updatedSpeakers);
    }
  };

  const handleDeleteSpeaker = async () => {
    const is_deleted: boolean = await deleteSpeaker(selectedSpeaker?.id);
    if (is_deleted) {
      closeDeleteSpeakerDialog();
      const updatedSpeakers = speakers.filter((speaker) => speaker.id !== selectedSpeaker?.id);
      setSpeakers(updatedSpeakers);
    }
  };

  const handleBannerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] || !selectedEvent) return;

    const file = event.target.files[0];
    const tempUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setSelectedImage(tempUrl);
    setCropModalOpen(true);
    setBanner(tempUrl);
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

  const speakerColumns = useMemo<ColumnDef<IEventSpeaker>[]>(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'name',
        header: () => 'Name',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.emailAddress}`,
        id: 'emailAddress',
        header: () => 'Email',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.primaryAffiliation}`,
        id: 'primaryAffiliation',
        header: () => 'Primary Affiliation',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.title}`,
        id: 'title',
        header: () => 'Title',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.headshot}`,
        id: 'headshot',
        header: () => 'Headshot',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.linkedInURL} ${row.twitterURL}`,
        id: 'linkedInURL',
        header: () => 'Social Links',
        enableSorting: true,
        cell: (info) => {
          const linkedInURL = info.row.original.linkedInURL;
          const twitterURL = info.row.original.twitterURL;

          return (
            <div className="flex gap-2">
              {linkedInURL && (
                <a
                  href={linkedInURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  <img className={'h-5 w-5'} src={LinkedInIcon} alt="My Icon" />
                </a>
              )}
              {twitterURL && (
                <a
                  href={twitterURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  <KeenIcon icon={'twitter'} />
                </a>
              )}
            </div>
          );
        }
      },
      {
        accessorFn: (row) => `${row.bio}`,
        id: 'bio',
        header: () => 'Bio',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.adminFullName}`,
        id: 'adminFullName',
        header: () => 'Admin Name',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.adminEmailAddress}`,
        id: 'adminEmailAddress',
        header: () => 'Admin Email',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        id: 'actions',
        header: () => 'Action',
        enableSorting: false,
        cell: (info) => (
          <button
            className="flex justify-center items-center  ml-3"
            onClick={() => openDeleteSpeakerDialog(info.row.original)}
          >
            <KeenIcon icon={'trash'} />
          </button>
        ),
        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      }
    ],
    []
  );

  const sponsorColumns = useMemo<ColumnDef<IEventSponsorship>[]>(
    () => [
      {
        accessorFn: (row) => row.organizationName,
        id: 'organizationName',
        header: () => 'Organization',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[50px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => row.eventName,
        id: 'eventName',
        header: () => 'Event',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[50px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => row.deckSent,
        id: 'deck_sent',
        header: () => 'Deck Sent',
        enableSorting: true,
        cell: (info) => <p>{info.getValue() ? 'Yes' : 'No'}</p>,
        meta: { className: 'min-w-[50px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => row.commitmentAmount,
        id: 'commitment_amount',
        header: () => 'Commitment Amount',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[50px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        id: 'actions',
        header: () => 'Action',
        enableSorting: false,
        cell: (info) => (
          <button
            className="flex justify-center items-center  ml-3"
            onClick={() => openDeleteSponsorDialog(info.row.original)}
          >
            <KeenIcon icon={'trash'} />
          </button>
        ),
        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      }
    ],
    []
  );

  const handleCopyURL = (path: string) => {
    const url = `${frontendURL}${path}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'URL copied to clipboard');
  };

  // Define the URLs and their labels
  const urls = [
    {
      label: 'Onboard URL',
      url: `${frontendURL}/public/onboard/${selectedEvent?.nanoId}`,
      path: `/public/onboard/${selectedEvent?.nanoId}`
    },
    {
      label: 'Sponsor Request',
      url: `${frontendURL}/public/sponsor/${selectedEvent?.nanoId}`,
      path: `/public/sponsor/${selectedEvent?.nanoId}`
    },
    {
      label: 'Speaker Request',
      url: `${frontendURL}/public/speaker/${selectedEvent?.nanoId}`,
      path: `/public/speaker/${selectedEvent?.nanoId}`
    },
    {
      label: 'Volunteer Request',
      url: `${frontendURL}/public/volunteer/${selectedEvent?.nanoId}`,
      path: `/public/volunteer/${selectedEvent?.nanoId}`
    }
  ];
  const fetchEventDetails = async () => {
    if (!selectedEvent) return;
    setLoading(true);

    try {
      const speakersData = await getSpeakersForEvent(selectedEvent?.id);
      setSpeakers(speakersData);

      const sponsorsData = await getEventSponsorships(selectedEvent?.id);
      setSponsors(sponsorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch speakers and sponsors data
  useEffect(() => {
    fetchEventDetails();
  }, [selectedEvent]);

  useEffect(() => {
    if (location.state) {
      const event = location.state.event as IEvent;
      const selected_event = location.state.event_id as number;

      if (selected_event) {
        const fetchEventByID = async (event_id: number) => {
          const eventDetails = await getEventById(event_id);
          setSelectedEvent(eventDetails);
        };
        fetchEventByID(selected_event);
      }

      if (event) {
        const fetchEventDetails = async () => {
          const eventDetails = await getEventById(event.id);
          setSelectedEvent(eventDetails);
        };
        fetchEventDetails();
      }
    }
  }, [location]);

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        meetup: selectedEvent.meetup || '',
        luma: selectedEvent.luma || '',
        eventBrite: selectedEvent.eventBrite || ''
      });
    }
  }, [selectedEvent]);

  return (
    <EventProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <div>
                  <p className={'text-2xl font-bold'}>{selectedEvent?.name}</p>
                  <p className={'text-sm font-normal text-gray-600'}>
                    {selectedEvent?.startDate && formatIsoDate(selectedEvent?.startDate)} -{' '}
                    {selectedEvent?.endDate && formatIsoDate(selectedEvent?.endDate)}
                  </p>
                </div>
                <BreadCrumb />
              </ToolbarHeading>
              <ToolbarActions>
                <button className="btn btn-sm btn-secondary" onClick={() => navigate(-1)}>
                  Back to Events
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 ">
            <div className="flex flex-col justify-center gap-2">
              <div
                className=" bg-cover border bg-no-repeat card-rounded-t flex items-center justify-center shrink-0 relative"
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
                  }')`
                }}
              ></div>
              <div className="items-center gap-2 text-sm font-normal text-gray-700 ">
                {/* Event description */}
                <div className="w-full card">
                  <div className={'card-header font-bold '}>
                    <p className={'flex items-center gap-2'}>
                      <img
                        className={'h-5 w-5'}
                        alt={'speaker-icon'}
                        src={toAbsoluteUrl('/media/coloured-icons/speaker.png')}
                      />
                      Speakers
                    </p>
                  </div>
                  <div className={'card-body'}>
                    <DataGrid
                      loading={loading}
                      data={speakers}
                      columns={speakerColumns}
                      rowSelect={false}
                      pagination={{ size: 5 }}
                      // sorting={[{ id: 'id', desc: true }]}
                    />
                  </div>
                </div>
                <div className="card mt-2">
                  <div className={'card-header font-bold'}>
                    <p className={'flex items-center gap-2'}>
                      <img
                        className={'h-5 w-5'}
                        alt={'speaker-icon'}
                        src={toAbsoluteUrl('/media/coloured-icons/sponsor.png')}
                      />
                      Sponsorships
                    </p>
                  </div>
                  <div className={'card-body'}>
                    <DataGrid
                      loading={loading}
                      data={sponsors}
                      columns={sponsorColumns}
                      rowSelect={false}
                      pagination={{ size: 5 }}
                      // sorting={[{ id: 'id', desc: true }]}
                    />
                  </div>
                </div>
              </div>
              <div className={'card'}>
                <div className={'card-header font-bold'}>
                  <p className={'flex items-center gap-2 text-sm'}>
                    <img
                      className={'h-5 w-5'}
                      alt={'speaker-icon'}
                      src={toAbsoluteUrl('/media/coloured-icons/form.png')}
                    />
                    Public Forms
                  </p>
                </div>
                <div>
                  <table className="table-auto w-full text-xs">
                    <thead className={'bg-gray-100 text-start flex-col justify-start'}>
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urls.map((url, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{url.label}</td>
                          <td className="border px-4 py-2">
                            {' '}
                            <div className=" flex flex-row items-center justify-center gap-2">
                              <div
                                className="text-xs font-medium btn btn-xs btn-secondary "
                                onClick={() => handleCopyURL(url.path)}
                              >
                                {url.label}
                                <KeenIcon icon="copy" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/*<div className="card-body grid grid-cols-4 gap-2">*/}
                {/*  {urls.map((url, index) => (*/}
                {/*    <div*/}
                {/*      key={index}*/}
                {/*      onClick={() => handleCopyURL(url.path)}*/}
                {/*      className="card bg-base-100 mb-3 p-4 border rounded-lg hover:shadow-lg cursor-pointer dark:bg-base-200 hover:dark:bg-base-300 transition-all"*/}
                {/*    >*/}
                {/*      <div className="flex flex-row items-center justify-center gap-2">*/}
                {/*        <div className="text-xs font-medium">{url.label}</div>*/}

                {/*        <KeenIcon icon="copy" />*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  ))}*/}
                {/*</div>*/}
              </div>
              <div className={'flex justify-end w-full mb-5 card'}>
                <div className="min-w-full">
                  {renderEditableField('eventBrite', 'EventBrite RSVP')}
                  {renderEditableField('meetup', 'Meetup RSVP')}
                  {renderEditableField('luma', 'Luma RSVP')}
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

        <DeleteSpeakerDialog
          isOpen={isDeleteSpeakerDialogOpen}
          onClose={closeDeleteSpeakerDialog}
          onDelete={handleDeleteSpeaker}
        />
        <DeleteSponsorDialog
          isOpen={isDeleteSponsorDialogOpen}
          onClose={closeDeleteSponsorDialog}
          onDelete={handleDeleteSponsor}
        />
      </Fragment>
    </EventProvider>
  );
};

export { EventDetailsPage };
