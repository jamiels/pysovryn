import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Dashboard } from '@/pages/dashboards';

import { AuthPage, RequireAuth } from '@/auth';

import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';

import { OrganizationPage } from '@/pages/views/organizations/OrganizationPage.tsx';
import { VenuePage } from '@/pages/views/venues/VenuePage.tsx';
import { VolunteersPage } from '@/pages/views/volunteers/VolunteersPage.tsx';
import { UserPage } from '@/pages/views/users/UserPage.tsx';
import { EventPage } from '@/pages/views/events/EventPage.tsx';
import { SponsorPage } from '@/pages/views/sponsors/SponsorPage.tsx';
import { SpeakersPage } from '@/pages/views/speakers/SpeakersPage.tsx';
import { PublicPageRoutes } from '@/pages/views/public/PublicPageRoutes.tsx';
import { AccountUserProfilePage } from '@/pages/account/user-profile';
import { SponsorRequestPage } from '@/pages/views/sponsorRequests/SponsotRequestPage.tsx';
import { SpeakerRequestPage } from '@/pages/views/speakerRequests/SpeakerRequestPage.tsx';
import { OnboardRequestPage } from '@/pages/views/OnboardRequests/OnboardRequestPage.tsx';
import { EventDetailsPage } from '@/pages/views/events/EventDetailsPage.tsx';
import { EventUpdatePage } from '@/pages/views/events/EventUpdatePage.tsx';
import { OrganizationUpdatePage } from '@/pages/views/organizations/OrganizationUpdatePage.tsx';
import { UpdateVenuePage } from '@/pages/views/venues/UpdateVenuePage.tsx';
import { SpeakerUpdatePage } from '@/pages/views/speakers/SpeakerUpdatePage.tsx';
import { UpdateSponsorPage } from '@/pages/views/sponsors/UpdateSponsorPage.tsx';
import { SpacePage } from '@/pages/views/space/SpacePage.tsx';
import { AdminEventPage } from '@/pages/views/admin/event/AdminEventPage.tsx';
import { AdminSpacePage } from '@/pages/views/admin/space/AdminSpacePage.tsx';
import { AdminUserPage } from '@/pages/views/admin/user/AdminUserPage.tsx';
import { AdminUserActivityPage } from '@/pages/views/admin/user-activity/AdminUserActivityPage.tsx';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />

          <Route
            path="/events/*"
            element={
              <Routes>
                <Route path="/" element={<EventPage />} />
                <Route path="/event-dashboard/" element={<EventDetailsPage />} />
                <Route path="/update-event/" element={<EventUpdatePage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/organizations/*"
            element={
              <Routes>
                <Route path="/" element={<OrganizationPage />} />
                <Route path="/update-organization" element={<OrganizationUpdatePage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/venues/*"
            element={
              <Routes>
                <Route path="/" element={<VenuePage />} />
                <Route path="/update-venue" element={<UpdateVenuePage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/sponsor-requests/*"
            element={
              <Routes>
                <Route path="/" element={<SponsorRequestPage />} />
              </Routes>
            }
          ></Route>

          <Route
            path="/speaking-requests/*"
            element={
              <Routes>
                <Route path="/" element={<SpeakerRequestPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/speaker-onboarding/*"
            element={
              <Routes>
                <Route path="/" element={<OnboardRequestPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/sponsorships/*"
            element={
              <Routes>
                <Route path="/" element={<SponsorPage />} />
                <Route path="/update-sponsor" element={<UpdateSponsorPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/users/*"
            element={
              <Routes>
                <Route path="/" element={<UserPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/volunteers/*"
            element={
              <Routes>
                <Route path="/" element={<VolunteersPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/admin/*"
            element={
              <Routes>
                <Route path="/events" element={<AdminEventPage />} />
                <Route path="/spaces" element={<AdminSpacePage />} />
                <Route path="/users" element={<AdminUserPage />} />
                <Route path={'/login-activity'} element={<AdminUserActivityPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/speakers/*"
            element={
              <Routes>
                <Route path="/" element={<SpeakersPage />} />
                <Route path="/update-speaker" element={<SpeakerUpdatePage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/spaces/*"
            element={
              <Routes>
                <Route path="/" element={<SpacePage />} />
              </Routes>
            }
          ></Route>
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
      <Route path="public/*" element={<PublicPageRoutes />} />
      <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
    </Routes>
  );
};

export { AppRoutingSetup };
