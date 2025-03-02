import React, { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { UserContent } from '@/pages/views/users/UserContent.tsx';
import { addNewSpaceUserByEmail } from '@/services/space_services.ts';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { ToolbarActions } from '@/layouts/demo1/toolbar';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const checkBoxContent = [
  { name: 'Events', formInput: 'isEventPermitted' },
  { name: 'Organizations', formInput: 'isOrganizationPermitted' },
  { name: 'Venues', formInput: 'isVenuePermitted' },
  { name: 'Sponsors', formInput: 'isSponsorPermitted' },
  { name: 'Speakers', formInput: 'isSpeakerPermitted' }
];

interface FormData {
  email: string;
  isEventPermitted: boolean;
  isOrganizationPermitted: boolean;
  isVenuePermitted: boolean;
  isSpeakerPermitted: boolean;
  isSponsorPermitted: boolean;
}

const UserPage = () => {
  const { currentLayout } = useLayout();
  const { activeSpace } = useSpace();

  const [isUserInvitedOpen, setIsUserInvitedOpen] = useState(false);

  const handleAddUser = async (userData: FormData) => {
    if (!activeSpace) {
      console.error('No active space selected');
      return;
    }

    try {
      await addNewSpaceUserByEmail({ spaceId: activeSpace.id, ...userData });

      handleCloseUserInvitedDialog();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOpenUserInvitedDialog = () => {
    setIsUserInvitedOpen(true);
  };

  const handleCloseUserInvitedDialog = () => {
    setIsUserInvitedOpen(false);
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={'Users'} />
              <ToolbarDescription>
                <BreadCrumb />
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <button className="btn btn-sm btn-primary" onClick={handleOpenUserInvitedDialog}>
                Add User
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <UserContent />
      </Container>
      {isUserInvitedOpen && (
        <UserManagementDialog
          email=""
          onAdd={handleAddUser}
          onClose={handleCloseUserInvitedDialog}
        />
      )}
    </Fragment>
  );
};

export { UserPage };

const UserManagementDialog: React.FC<{
  email: string;
  onAdd: (data: FormData) => Promise<void>;
  onClose: () => void;
}> = ({ email, onAdd, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    email: email,
    isEventPermitted: true,
    isOrganizationPermitted: true,
    isVenuePermitted: true,
    isSpeakerPermitted: true,
    isSponsorPermitted: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd(formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="dark:bg-neutral-950 bg-white rounded-lg p-6 w-full max-w-sm transform transition-all duration-300">
        <form onSubmit={handleAddSubmit}>
          <h3 className="text-lg font-semibold mb-4">Add User to Space</h3>
          <div className="form-control">
            <label className="label text-sm">Email Address</label>
            <input
              type="email"
              className="input input-bordered"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoFocus
            />
          </div>

          <p className={'text-sm mt-5 font-semibold'}>Page Access Permissions</p>
          <div className="grid grid-cols-1 gap-4 mt-3">
            {checkBoxContent.map((tool) => (
              <label key={tool.formInput} className="flex items-center">
                <input
                  type="checkbox"
                  value={tool.formInput}
                  checked={formData[tool.formInput as keyof FormData] as boolean}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [tool.formInput]: e.target.checked
                    })
                  }
                  className="checkbox checkbox-sm"
                />
                <span className="ml-2 text-sm">{tool.name}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Submit'}
            </button>{' '}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
