/*
import React, { useState, useMemo, useEffect } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { KeenIcon } from '@/components';
import { IEvent } from '@/services/interfaces/event.i.ts';
import { DataGrid } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IEventSpeaker } from '@/services/interfaces/speakers.i.ts';
import { deleteSpeaker, getSpeakersForEvent } from '@/services/speakers_service.ts';
import { IEventSponsorship } from '@/services/interfaces/sponsorships.i.ts';
import { deleteSponsor, getEventSponsorships } from '@/services/sponsorship_services.ts';
import LinkedInIcon from '@/media/social/linkedin.svg';
import { DeleteSpeakerDialog } from '@/pages/views/speakers/speaker-table/Speakers.tsx';
import { DeleteSponsorDialog } from '@/pages/views/sponsors/sponsor-table/Sponsors.tsx';

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: IEvent | null;
}

export const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  isOpen,
  onClose,
  selectedEvent
}) => {
  const [speakers, setSpeakers] = useState<IEventSpeaker[]>([]);
  const [sponsors, setSponsors] = useState<IEventSponsorship[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteSpeakerDialogOpen, setIsDeleteSpeakerDialogOpen] = useState(false);
  const [isDeleteSponsorDialogOpen, setIsDeleteSponsorDialogOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<IEventSpeaker | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<IEventSponsorship | null>(null);

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

  // Fetch speakers and sponsors data
  useEffect(() => {
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

    fetchEventDetails();
  }, [selectedEvent]);

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
        accessorFn: (row) => `${row.headshotURL}`,
        id: 'headshotURL',
        header: () => 'Headshot',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { className: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => `${row.linkedInURL} ${row.twitterURL}`, // Ensure both URLs are passed
        id: 'linkedInURL',
        header: () => 'Social Links', // Update the header to reflect the links
        enableSorting: true,
        cell: (info) => {
          const linkedInURL = info.row.original.linkedInURL; // Access LinkedIn URL
          const twitterURL = info.row.original.twitterURL; // Access Twitter URL

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

  return (
    <Modal open={isOpen} onClose={onClose} className="!flex ">
      <ModalContent className="container-fluid dark:border  px-6 sm:px-10 md:px-10 pt-7.5 my-[3%] w-[95%] max-w-screen-sm sm:max-w-screen-lg md:max-w-screen-xl lg:max-w-screen-2xl">
        <ModalHeader className="p-0 border-0 ">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 pt-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none flex flex-row text-gray-900 items-center gap-2">
                <KeenIcon icon={'calendar-add'} />
                <p>Event Details</p>
              </h1>
              <ModalBody className="flex flex-col w-full items-center gap-2 text-sm font-normal text-gray-700 mt-5 h-full overflow-y-auto max-h-[60vh]">
                {/!* Event description *!/}
                <div className="w-full">
                  <p className={'font-bold mb-2 flex items-center gap-2'}>
                    <KeenIcon icon={'abstract-39'} />
                    Speakers
                  </p>
                  <DataGrid
                    loading={loading}
                    data={speakers}
                    columns={speakerColumns}
                    rowSelect={false}
                    pagination={{ size: 5 }}
                    // sorting={[{ id: 'id', desc: true }]}
                  />
                </div>
                <div className="w-full mt-5">
                  <p className={'font-bold mb-2 flex items-center gap-2'}>
                    <KeenIcon icon={'star'} />
                    Sponsorships
                  </p>
                  <DataGrid
                    loading={loading}
                    data={sponsors}
                    columns={sponsorColumns}
                    rowSelect={false}
                    pagination={{ size: 5 }}
                    // sorting={[{ id: 'id', desc: true }]}
                  />
                </div>
              </ModalBody>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7" children={undefined}></ModalBody>
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
      </ModalContent>
    </Modal>
  );
};
*/
