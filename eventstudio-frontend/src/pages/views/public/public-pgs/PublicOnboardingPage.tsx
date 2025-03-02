import React, { Fragment, useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { IPublicOnboardSpeakerRequest } from '@/services/interfaces/public_forms.i';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { addOnboardRequest } from '@/services/publicForms/public_onboard_services';
import { PublicFooter } from '@/pages/statics/components/PublicFooter';
import { getEventByUUID } from '@/services/event_services';
import { IEvent } from '@/services/interfaces/event.i.ts';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { formatIsoDate } from '@/utils/Date.ts';

export const PublicOnboardingPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [banner, setBanner] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<IPublicOnboardSpeakerRequest | null>({
    fullName: '',
    email: '',
    bio: '',
    linkedInURL: '',
    twitterURL: '',
    title: '',
    organization: '',
    headshotURL: '',
    eventUUID: '',
    captchaToken: ''
  });
  const [headshot, setHeadshot] = useState<File | null>(null); // For the file upload

  // Update form data with the event uuid
  useEffect(() => {
    if (uuid) {
      setFormData((prevData) => ({
        ...prevData,
        eventUUID: uuid,
        fullName: prevData?.fullName || '',
        email: prevData?.email || '',
        bio: prevData?.bio || '',
        linkedInURL: prevData?.linkedInURL || '',
        twitterURL: prevData?.twitterURL || '',
        title: prevData?.title || '',
        organization: prevData?.organization || '',
        headshotURL: prevData?.headshotURL || '',
        captchaToken: prevData?.captchaToken || ''
      }));
    }
  }, [uuid]);

  // Fetch event details
  useEffect(() => {
    if (uuid) {
      getEventByUUID(uuid)
        .then((event) => {
          setSelectedEvent(event);
        })
        .catch(() => navigate('/'));
    }
  }, [uuid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setHeadshot(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!executeRecaptcha) {
      console.warn('Execute reCAPTCHA not yet available');
      return;
    }

    try {
      const token = await executeRecaptcha('LOGIN');

      setFormData((prevData) => ({
        ...prevData,
        captchaToken: token,
        fullName: prevData?.fullName || '',
        email: prevData?.email || '',
        bio: prevData?.bio || '',
        linkedInURL: prevData?.linkedInURL || '',
        twitterURL: prevData?.twitterURL || '',
        title: prevData?.title || '',
        organization: prevData?.organization || '',
        headshotURL: prevData?.headshotURL || '',
        eventUUID: prevData?.eventUUID || ''
      }));

      const updatedFormData = {
        ...formData,
        captchaToken: token
      };

      if (!updatedFormData.captchaToken) return;
      const isRequestSent = await addOnboardRequest(updatedFormData, headshot);
      if (isRequestSent) {
        navigate('/public/success');
      }
    } catch (error) {
      console.error('Error submitting onboarding request:', error);
    }
  };

  // Shared banner style used for the sticky header
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
      <div className="overflow-hidden flex flex-col bg-cover bg-no-repeat page-bg grow items-center w-full h-full p-2 pb-[3%] ">
        <div
          className="card w-full max-w-screen-xl flex flex-col h-full overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div>
            <div
              className="w-full md:h-54 bg-cover  bg-no-repeat border card-rounded-t"
              style={bannerStyle}
            ></div>
            <div className="p-4 md:p-10  border-b">
              <div className="flex flex-col items-center justify-center  text-center">
                <p className="text-[200%] font-bold text-gray-900">{selectedEvent?.name}</p>
                <p className="text-xs mt-2 text-gray-900">
                  {selectedEvent?.startDate && formatIsoDate(selectedEvent.startDate)}
                  {selectedEvent?.endDate && ` - ${formatIsoDate(selectedEvent.endDate)}`}
                </p>
                <p className="text-sm text-gray-900 ">
                  Please enter speaker onboarding details for <strong>{selectedEvent?.name}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1  p-2 md:p-5">
            <form className="space-y-2" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData?.fullName}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <input
                  type="text"
                  name="bio"
                  value={formData?.bio}
                  onChange={handleInputChange}
                  className="input  w-full"
                  maxLength={500}
                />
                {(formData?.bio?.length || 0) >= 500 ? (
                  <div className="text-right text-xs text-red-500 mt-1">
                    Reached maximum characters
                  </div>
                ) : (
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData?.bio?.length || 0}/500
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    name="linkedInURL"
                    value={formData?.linkedInURL}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter Profile</label>
                  <input
                    type="text"
                    name="twitterURL"
                    value={formData?.twitterURL}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData?.organization}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Head Shot</label>
                <input
                  type="file"
                  name="headshot"
                  onChange={handleFileChange}
                  className="input w-full"
                />
              </div>
              <div className="flex justify-center gap-3">
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
