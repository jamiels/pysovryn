import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';

import { IOrganizationRequest } from '@/services/interfaces/org.i.ts';
import { addOrganization } from '@/services/organization_services.ts';
import { useOrganizations } from '@/pages/views/organizations/OrganizationContext.tsx';
import { useSpace } from '@/contexts/SpaceContext.tsx';

interface AddOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddOrganizationDialog: React.FC<AddOrganizationDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState<IOrganizationRequest>({
    name: '',
    space_id: 0
  });

  const { fetchOrganizations } = useOrganizations();
  const { activeSpace } = useSpace();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, space_id: activeSpace?.id as number }));
  }, [activeSpace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const is_sent = await addOrganization(formData);
    if (is_sent) {
      fetchOrganizations();
      onClose(); // Close the dialog after submission
      setFormData({
        name: '',
        space_id: activeSpace?.id as number
      });
    }
  };

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
                <p>Organization</p>
              </h1>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className={'space-y-1'}>
              <label className="block text-sm font-medium text-gray-700"> Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input  w-full"
                placeholder="Enter organization name"
                required
              />
            </div>

            <div className="flex justify-end gap-3 ">
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
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
