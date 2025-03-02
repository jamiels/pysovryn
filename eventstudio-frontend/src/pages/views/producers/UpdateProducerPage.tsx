import React, { Fragment, useEffect, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ProducerProvider, useProducers } from '@/pages/views/producers/ProducerContext.tsx';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { IProducer, IProducerUpdateRequest } from '@/services/interfaces/producer.i.ts';
import { updateProducer } from '@/services/producer_services.s.ts';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { KeenIcon } from '@/components';

const ProducerUpdateContent = () => {
  const { currentLayout } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedProducer, setSelectedProducer] = useState<IProducer | null>(null);

  useEffect(() => {
    if (location.state) {
      setSelectedProducer(location.state as IProducer);
    } else {
      navigate('/producers');
    }
  }, [location, navigate]);

  const { fetchProducers } = useProducers();
  const { activeSpace } = useSpace();

  // State for the form data
  const [formData, setFormData] = useState<IProducerUpdateRequest>({
    name: '',
    space_id: selectedProducer?.space_id || activeSpace?.id || 0
  });

  // Handle input changes for the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProducer) return;
    if (!formData.space_id) return;

    const is_updated = await updateProducer(selectedProducer.id, formData);
    if (is_updated) {
      fetchProducers();
      navigate(-1);
      setFormData({
        name: '',
        space_id: activeSpace?.id || 0
      });
    }
  };

  // Effect to update form data based on selectedProducer and activeSpace
  useEffect(() => {
    if (activeSpace) {
      setFormData((prev) => ({ ...prev, space_id: activeSpace.id }));
    }
    if (selectedProducer) {
      setFormData({
        name: selectedProducer.name,
        space_id: activeSpace?.id || selectedProducer.space_id
      });
    }
  }, [selectedProducer, activeSpace]);

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={`Update Producer: ${selectedProducer?.name}`} />
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className="flex justify-center items-center py-10 ">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Producer Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-sm w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Producer name"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" className="btn btn-sm btn-outline" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary">
                Update Producer
              </button>
            </div>
          </form>
        </div>
      </Container>
    </Fragment>
  );
};

export const UpdateProducerPage = () => {
  return (
    <ProducerProvider>
      <ProducerUpdateContent />
    </ProducerProvider>
  );
};
