import React, { Fragment, useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { IPublicSponsorRequest } from '@/services/interfaces/public_forms.i';
import { useParams } from 'react-router-dom';
import { addSponsorRequest } from '@/services/publicForms/public_sponsor_services';
import { useNavigate } from 'react-router';
import { PublicFooter } from '@/pages/statics/components/PublicFooter';
import { getEventByUUID } from '@/services/event_services';
import { IEvent } from '@/services/interfaces/event.i';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { showToast } from '@/utils/toast_helper';
import { formatIsoDate } from '@/utils/Date';

export const PublicSponsorPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [banner, setBanner] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [formData, setFormData] = useState<IPublicSponsorRequest | null>({
    name: '',
    email: '',
    involvement: '',
    linkedIn: '',
    eventUUID: '',
    captchaToken: ''
  });

  useEffect(() => {
    if (uuid) {
      setFormData((prevData) => ({
        ...prevData,
        eventUUID: uuid,
        name: prevData?.name || '',
        email: prevData?.email || '',
        involvement: prevData?.involvement || '',
        linkedIn: prevData?.linkedIn || '',
        captchaToken: prevData?.captchaToken || ''
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
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
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
      eventUUID: prevData?.eventUUID || '',
      name: prevData?.name || '',
      email: prevData?.email || '',
      involvement: prevData?.involvement || '',
      linkedIn: prevData?.linkedIn || '',
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

    const isRequestSent = await addSponsorRequest(updatedFormData);
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
        {/* Card Container with shared max-width and scroll */}
        <div
          className="card w-full max-w-screen-xl flex flex-col h-full overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div>
            <div
              className="md:h-54 w-full bg-cover bg-no-repeat border card-rounded-t"
              style={bannerStyle}
            ></div>
            <div className="p-2 md:p-10 border-b">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-[200%] font-bold text-gray-900">{selectedEvent?.name}</p>
                <p className="text-xs mt-2 text-gray-900">
                  {selectedEvent?.startDate && formatIsoDate(selectedEvent.startDate)}
                  {selectedEvent?.endDate && ` - ${formatIsoDate(selectedEvent.endDate)}`}
                </p>
                <p className="text-sm text-gray-900">
                  Please enter sponsor details for <strong>{selectedEvent?.name}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-2 md:p-5">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className={'grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name}
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
              <div className={'grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Involvement</label>
                  <input
                    type="text"
                    name="involvement"
                    value={formData?.involvement}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    name="linkedIn"
                    value={formData?.linkedIn}
                    onChange={handleInputChange}
                    className="input  w-full"
                    required
                  />
                </div>
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
