import { Container } from '@/components/container';
import { generalSettings } from '@/config';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const frontEndURL = import.meta.env.VITE_APP_FRONTEND_URL;
  const homepageURL = import.meta.env.VITE_HOMEPAGE_URL;

  return (
    <footer className="footer">
      <Container>
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5">
          <div className="flex order-2 md:order-1  gap-2 font-normal text-2sm">
            <span className="text-gray-500">{currentYear} &copy;</span>
            <a
              href={homepageURL}
              target="_blank"
              className="text-gray-600 hover:text-primary cursor-pointer"
            >
              EventStudio. All Rights Reserved.
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
