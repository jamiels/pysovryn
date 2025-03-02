import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { KeenIcon } from '@/components';

import { ISpace, ISpaceUpdateRequest } from '@/services/interfaces/space.i.ts';
import { updateSpace } from '@/services/space_services.ts';
import { useSpace } from '@/contexts/SpaceContext.tsx';

interface SpaceUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpace: ISpace | null;
}

export const SpaceUpdateDialog: React.FC<SpaceUpdateDialogProps> = ({
  isOpen,
  onClose,
  selectedSpace
}) => {
  const [formData, setFormData] = useState<ISpaceUpdateRequest>({
    spaceName: '',
    spaceUsers: []
  });

  const { fetchSpaces } = useSpace();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const is_updated = await updateSpace(selectedSpace?.id as number, formData);
    if (is_updated) {
      onClose(); // Close the dialog after submission
      fetchSpaces();
      setFormData({
        spaceName: '',
        spaceUsers: []
      });
    }
  };

  useEffect(() => {
    if (selectedSpace) {
      setFormData({
        spaceName: selectedSpace.spaceName,
        spaceUsers: selectedSpace.spaceUserIDs
      });
    } else {
      setFormData({
        spaceName: '',
        spaceUsers: []
      });
    }
  }, [selectedSpace]);

  return (
    <Modal open={isOpen} onClose={onClose} className="flex items-center justify-center">
      <ModalContent
        className="container-fixed px-6 sm:px-10 md:px-20 overflow-hidden pt-7.5 my-[10%]
               w-[95%] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl dark:border-gray-50/20 dark:border"
      >
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 pt-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none flex flex-row text-gray-900 items-center gap-2">
                <p>Update Space</p>
              </h1>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className={'grid grid-cols-2 gap-2 items-center'}>
              <label className="block text-sm font-medium text-gray-700">Space Name</label>
              <input
                type="text"
                name="spaceName"
                value={formData.spaceName}
                onChange={handleInputChange}
                className="input  w-full"
                placeholder="Enter Space name"
                required
              />
            </div>

            <div className="flex justify-end gap-3 ">
              <button type="button" className="btn btn-sm btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
