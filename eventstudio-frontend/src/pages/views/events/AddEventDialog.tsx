import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { IEventAddRequest } from '@/services/interfaces/event.i.ts';

import { getAuth } from '@/auth';
import { addEvent } from '@/services/event_services.ts';
import { useEvents } from '@/pages/views/events/EventContext.tsx';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { useNavigate } from 'react-router';

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEventDialog: React.FC<AddEventDialogProps> = ({ isOpen, onClose }) => {
  const { fetchEvents } = useEvents();
  const { activeSpace } = useSpace();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [navigatingPage, setNavigatingPage] = useState<'update' | 'event'>('update');

  const [formData, setFormData] = useState<IEventAddRequest>({
    userId: getAuth()?.user.userId as number,
    name: '',
    space_id: activeSpace?.id as number
  });

  const handleSetNavigatingPage = (page: 'update' | 'event') => {
    setNavigatingPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const addedEvent = await addEvent(formData);
    setLoading(false);

    if (addedEvent?.id) {
      fetchEvents();
      onClose();
      if (navigatingPage === 'event') {
        navigate('/events/');
      }
      if (navigatingPage === 'update') {
        navigate(`/events/update-event/`, { state: { event: addedEvent } });
      }
      setFormData({
        userId: getAuth()?.user.userId as number,
        name: '',
        space_id: activeSpace?.id as number
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} className="!flex justify-center items-center">
      <ModalContent
        className="container-fixed px-6 sm:px-10 md:px-20 overflow-hidden pt-7.5 my-[3%] h-[95%] max-h-[40%]
                   w-[95%] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl dark:border-gray-50/20 dark:border"
      >
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 pt-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none flex flex-row text-gray-900 items-center gap-2">
                <p>Add New Event</p>
              </h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                Create and manage your events effortlessly.
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={' items-center gap-2 grid grid-cols-2'}>
              <label className="block text-sm font-medium text-gray-700 "> Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className={`btn btn-sm btn-primary ${loading && navigatingPage === 'event' ? 'cursor-not-allowed disabled' : ''}`}
                onClick={() => handleSetNavigatingPage('event')}
              >
                {loading && navigatingPage === 'event' ? 'Creating...' : 'Submit'}
              </button>
              <button
                type="submit"
                className={`btn btn-sm btn-primary ${loading && navigatingPage === 'update' ? 'cursor-not-allowed disabled' : ''}`}
                onClick={() => handleSetNavigatingPage('update')}
              >
                {loading && navigatingPage === 'update' ? 'Creating...' : 'Submit & Update'}
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
