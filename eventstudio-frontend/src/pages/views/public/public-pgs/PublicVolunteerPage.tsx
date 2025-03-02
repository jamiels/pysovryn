import React, { Fragment, useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { addPublicVolunteer } from '@/services/publicForms/public_volunteer_service.ts';
import { IPublicVolunteerRequest } from '@/services/interfaces/public_forms.i.ts';
import { PublicFooter } from '@/pages/statics/components/PublicFooter.tsx';
import { IEvent } from '@/services/interfaces/event.i.ts';
import { getEventByUUID } from '@/services/event_services.ts';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { showToast } from '@/utils/toast_helper.ts';
import { formatIsoDate } from '@/utils/Date.ts';

export const PublicVolunteerPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [banner, setBanner] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [formData, setFormData] = useState<IPublicVolunteerRequest>({
    fullName: '',
    email: '',
    mobilePhone: '',
    telegramID: '',
    linkedInURL: '',
    businessAttire: false,
    communicationTools: [],
    areasOfSupport: [],
    eventUUID: '',
    captchaToken: ''
  });

  useEffect(() => {
    if (uuid) {
      setFormData((prevData) => ({
        ...prevData,
        eventUUID: uuid,
        fullName: prevData.fullName || '',
        email: prevData.email || '',
        mobilePhone: prevData.mobilePhone || '',
        telegramID: prevData.telegramID || '',
        linkedInURL: prevData.linkedInURL || '',
        businessAttire: prevData.businessAttire || false,
        communicationTools: prevData.communicationTools || [],
        areasOfSupport: prevData.areasOfSupport || [],
        captchaToken: prevData.captchaToken || ''
      }));

      getEventByUUID(uuid)
        .then((event) => {
          setSelectedEvent(event);
        })
        .catch(() => navigate('/'));
    }
  }, [uuid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: string,
    value: string | boolean,
    type: 'array' | 'boolean'
  ) => {
    if (type === 'array') {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: (prev[name as keyof IPublicVolunteerRequest] as string[]).includes(
            value as string
          )
            ? (prev[name as keyof IPublicVolunteerRequest] as string[]).filter(
                (item: string) => item !== value
              )
            : [...(prev[name as keyof IPublicVolunteerRequest] as string[]), value as string]
        } as IPublicVolunteerRequest;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      console.warn('Execute reCAPTCHA not yet available');
      return;
    }

    const token = await executeRecaptcha('LOGIN');

    setFormData((prevData) => ({
      ...prevData,
      captchaToken: token
    }));

    const updatedFormData = {
      ...formData,
      captchaToken: token
    };

    if (!updatedFormData.captchaToken) {
      showToast('error', 'Please complete the reCAPTCHA challenge and submit the form again');
      return;
    }

    const isRequestSent = await addPublicVolunteer(updatedFormData);
    if (isRequestSent) {
      navigate('/public/success');
    }
  };

  // Shared banner style
  const bannerStyle = {
    backgroundImage: `url('${
      banner
        ? toAbsoluteUrl(banner)
        : selectedEvent?.banner
          ? toAbsoluteUrl(selectedEvent.banner)
          : toAbsoluteUrl('/media/auth_bg.jpg')
    }')`,
    aspectRatio: '8/1',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <Fragment>
      <div className="overflow-hidden flex flex-col bg-cover bg-no-repeat page-bg grow items-center w-full h-full p-2 pb-[3%]">
        {/* Card Container with shared max-width */}
        <div
          className="card w-full max-w-screen-xl flex flex-col h-full overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div>
            <div
              className="md:h-54 w-full bg-cover  bg-no-repeat border card-rounded-t"
              style={bannerStyle}
            ></div>
            <div className="p-2 md:p-4 border-b">
              <div className="flex flex-col items-center">
                <p className="text-[200%] font-bold text-gray-900">{selectedEvent?.name}</p>
                <p className="text-xs mt-2 text-gray-900">
                  {selectedEvent?.startDate && formatIsoDate(selectedEvent.startDate)}
                  {selectedEvent?.endDate && ` - ${formatIsoDate(selectedEvent.endDate)}`}
                </p>
                <p className="text-sm text-gray-900 mt-3 md:mt-5">
                  Please enter volunteer details for <strong>{selectedEvent?.name}</strong>
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex-1  p-4 md:p-5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 w-full">
              {/* Two-column layout for basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
                {/* Mobile Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Phone #</label>
                  <input
                    type="text"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
                {/* Telegram ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telegram ID</label>
                  <input
                    type="text"
                    name="telegramID"
                    value={formData.telegramID}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
                {/* LinkedIn URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedInURL"
                    value={formData.linkedInURL}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
              </div>
              {/* Communication Tools */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Communication Tools (select all that apply)
                </label>
                <div className="grid grid-cols-1 mt-2 gap-4">
                  {['WhatsApp', 'Telegram', 'Slack'].map((tool) => (
                    <label key={tool} className="flex items-center">
                      <input
                        type="checkbox"
                        value={tool}
                        checked={formData.communicationTools.includes(tool)}
                        onChange={() => handleCheckboxChange('communicationTools', tool, 'array')}
                        className="checkbox checkbox-sm"
                      />
                      <span className="ml-2 text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Areas of Support */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Areas of Support (select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2  mt-2 gap-4">
                  {[
                    'Check-in / Registration Desk',
                    'Social media posts',
                    'Photography',
                    'Escorting and Directing Guest Traffic',
                    'A/V Setup and Management',
                    "Promoting Events (You're an influencer)",
                    'Managing Caterer',
                    'Other'
                  ].map((area) => (
                    <label key={area} className="flex items-center">
                      <input
                        type="checkbox"
                        value={area}
                        checked={formData.areasOfSupport.includes(area)}
                        onChange={() => handleCheckboxChange('areasOfSupport', area, 'array')}
                        className="checkbox checkbox-sm"
                      />
                      <span className="ml-2 text-sm">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Business Attire */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Are you okay with wearing business casual attire at our events?
                </label>
                <div className="flex gap-4 mt-2">
                  {[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false }
                  ].map((option) => (
                    <label key={option.label} className="flex items-center">
                      <input
                        type="radio"
                        name="businessAttire"
                        value={option.value.toString()}
                        checked={formData.businessAttire === option.value}
                        onChange={() =>
                          handleCheckboxChange('businessAttire', option.value, 'boolean')
                        }
                        className="radio radio-sm"
                      />
                      <span className="ml-2 text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <PublicFooter />
      </div>
    </Fragment>
  );
};
