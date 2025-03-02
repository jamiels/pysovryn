import React, { Fragment, useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { IPublicSpeakerRequest } from '@/services/interfaces/public_forms.i.ts';
import { addPublicSpeaker } from '@/services/publicForms/public_speaker_service.ts';
import { PublicFooter } from '@/pages/statics/components/PublicFooter.tsx';
import { IEvent } from '@/services/interfaces/event.i.ts';
import { getEventByUUID } from '@/services/event_services.ts';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { showToast } from '@/utils/toast_helper.ts';
import { formatIsoDate } from '@/utils/Date.ts';

export const PublicSpeakerPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [banner, setBanner] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [formData, setFormData] = useState<IPublicSpeakerRequest | null>({
    fullName: '',
    email: '',
    abstract: '',
    linkedInURL: '',
    organization: '',
    panelists: false,
    sponsorshipInterest: '',
    title: '',
    eventUUID: '',
    captchaToken: ''
  });

  useEffect(() => {
    if (uuid) {
      setFormData((prevData) => ({
        ...prevData,
        eventUUID: uuid,
        fullName: prevData?.fullName || '',
        email: prevData?.email || '',
        abstract: prevData?.abstract || '',
        linkedInURL: prevData?.linkedInURL || '',
        organization: prevData?.organization || '',
        panelists: prevData?.panelists || false,
        sponsorshipInterest: prevData?.sponsorshipInterest || '',
        title: prevData?.title || '',
        captchaToken: prevData?.captchaToken || ''
      }));

      getEventByUUID(uuid)
        .then((event) => {
          setSelectedEvent(event);
        })
        .catch(() => navigate('/'));
    }
  }, [uuid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'panelists') {
      setFormData((prev) => (prev ? { ...prev, panelists: value === 'true' } : prev));
    } else {
      setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      console.warn('Execute reCAPTCHA not yet available');
      return;
    }

    if (!formData) return;
    const token = await executeRecaptcha('LOGIN');

    setFormData((prevData) => ({
      ...prevData,
      captchaToken: token,
      fullName: prevData?.fullName || '',
      email: prevData?.email || '',
      abstract: prevData?.abstract || '',
      linkedInURL: prevData?.linkedInURL || '',
      organization: prevData?.organization || '',
      panelists: prevData?.panelists || false,
      sponsorshipInterest: prevData?.sponsorshipInterest || '',
      title: prevData?.title || '',
      eventUUID: prevData?.eventUUID || ''
    }));

    const updatedFormData = {
      ...formData,
      captchaToken: token
    };

    if (!updatedFormData.captchaToken) {
      showToast('error', 'Please complete the reCAPTCHA challenge and submit the form again');
      return;
    }
    const isRequestSent = await addPublicSpeaker(updatedFormData);
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
      <div className="overflow-hidden flex flex-col bg-cover bg-no-repeat page-bg grow items-center w-full h-full p-2 pb-[3%] ">
        {/* Card container with shared max-width */}
        <div
          className="card w-full max-w-screen-xl flex flex-col h-full overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div>
            <div
              className="md:h-54 w-full bg-cover  bg-no-repeat border card-rounded-t"
              style={bannerStyle}
            ></div>
            <div className="p-2 md:p-10 border-b">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-[200%] font-bold text-gray-900">{selectedEvent?.name}</p>
                <p className="text-xs mt-2 text-gray-900">
                  {selectedEvent?.startDate && formatIsoDate(selectedEvent.startDate)}
                  {selectedEvent?.endDate && ` - ${formatIsoDate(selectedEvent.endDate)}`}
                </p>
                <p className="text-sm text-gray-900 mt-3 md:mt-5 ">
                  Submit a speaking request for <strong>{selectedEvent?.name}</strong> below.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-5">
            <form className="space-y-4 md:space-y-6 w-full" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData?.fullName}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Professional Email
                  </label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData?.organization}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    name="linkedInURL"
                    value={formData?.linkedInURL}
                    onChange={handleInputChange}
                    className="input  w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Talk/Panel Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Panel Creation Ability
                  </label>
                  <select
                    name="panelists"
                    className="select  w-full"
                    value={formData?.panelists.toString()}
                    required
                    onChange={(e) => handleSelectChange('panelists', e.target.value)}
                  >
                    <option value="" disabled>
                      Select panel status
                    </option>
                    <option value="true">Yes, I can create a panel</option>
                    <option value="false">No, I need help</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Talk Abstract (max 500 characters)
                </label>
                <textarea
                  name="abstract"
                  value={formData?.abstract}
                  onChange={handleInputChange}
                  className="textarea textarea-sm w-full h-32"
                  maxLength={500}
                  required
                />
                <div className="text-right text-xs md:text-sm mt-1">
                  <span
                    className={`${
                      (formData?.abstract?.length || 0) === 500 ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    {formData?.abstract?.length || 0}/500
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sponsorship Interest
                </label>
                <select
                  name="sponsorshipInterest"
                  className="select  w-full"
                  value={formData?.sponsorshipInterest}
                  required
                  onChange={(e) => handleSelectChange('sponsorshipInterest', e.target.value)}
                >
                  <option value="" disabled>
                    Select sponsorship interest
                  </option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Possibly">Possibly</option>
                </select>
              </div>

              <div className="mt-6 flex justify-center">
                <button type="submit" className="btn btn-primary  md:w-auto text-center">
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
