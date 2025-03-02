import React, { Fragment, useEffect, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { useVenue, VenueProvider } from '@/pages/views/venues/VenueContext.tsx';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { updateVenue } from '@/services/venue_services.ts';
import { IVenue, IVenueUpdateRequest } from '@/services/interfaces/venue.i.ts';

import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const UpdateVenuePage = () => {
  return (
    <VenueProvider>
      <VenueUpdateContent />
    </VenueProvider>
  );
};

const VenueUpdateContent = () => {
  const { currentLayout } = useLayout();

  const { fetchVenues } = useVenue();
  const { activeSpace } = useSpace();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedVenue, setSelectedVenue] = useState<IVenue | null>(null);

  useEffect(() => {
    if (location.state) {
      const venue = location.state.venue as IVenue;
      setSelectedVenue(venue);
    }
  }, [location]);

  const [formData, setFormData] = useState<IVenueUpdateRequest>({
    name: selectedVenue?.name || '',
    space_id: selectedVenue?.space_id || 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVenue) return;
    if (!formData.space_id) return;

    const is_updated = await updateVenue(selectedVenue?.id, formData);
    if (is_updated) {
      fetchVenues();
      navigate(-1);
      setFormData({
        name: '',
        space_id: 0
      });
    }
  };

  useEffect(() => {
    if (activeSpace) {
      setFormData((prev) => ({ ...prev, space_id: activeSpace.id }));
    }
  }, [activeSpace]);

  useEffect(() => {
    if (selectedVenue) {
      setFormData({
        name: selectedVenue.name,
        space_id: selectedVenue.space_id || (activeSpace?.id as number) || 0
      });
    } else {
      setFormData({
        name: '',
        space_id: (activeSpace?.id as number) || 0
      });
    }
  }, [selectedVenue, activeSpace]);

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={'Venues'} />
              <ToolbarDescription>Update {selectedVenue?.name}</ToolbarDescription>
              <BreadCrumb />
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className={'card'}>
          <div className={'card-header'}>
            {' '}
            <p className={'text-md font-semibold'}>Update: {selectedVenue?.name}</p>{' '}
          </div>
          <div className={'card-body'}>
            <div className="flex justify-center items-center py-10 ">
              <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Venue name"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 ">
                  <button type="submit" className="btn btn-sm btn-primary">
                    Submit
                  </button>{' '}
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

export { UpdateVenuePage };
