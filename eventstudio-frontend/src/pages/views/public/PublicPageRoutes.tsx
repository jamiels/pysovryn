import { Route, Routes } from 'react-router';
import { PublicSponsorPage } from '@/pages/views/public/public-pgs/PublicSponsorPage.tsx';
import { PublicOnboardingPage } from '@/pages/views/public/public-pgs/PublicOnboardingPage.tsx';
import { PublicSpeakerPage } from '@/pages/views/public/public-pgs/PublicSpeakerPage.tsx';
import { PublicVolunteerPage } from '@/pages/views/public/public-pgs/PublicVolunteerPage.tsx';
import { RequestSuccessPage } from '@/pages/statics/RequestSuccessPage.tsx';

const PublicPageRoutes = () => (
  <Routes>
    <Route path="/sponsor/:uuid" element={<PublicSponsorPage />} />
    <Route path="/onboard/:uuid" element={<PublicOnboardingPage />} />
    <Route path="/speaker/:uuid" element={<PublicSpeakerPage />} />
    <Route path="/volunteer/:uuid" element={<PublicVolunteerPage />} />
    <Route path={'/success'} element={<RequestSuccessPage />} />
  </Routes>
);

export { PublicPageRoutes };
