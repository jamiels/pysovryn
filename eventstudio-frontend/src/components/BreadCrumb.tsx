import { Link, useLocation } from 'react-router-dom';

export const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x !== '');

  const breadcrumbs = [{ name: 'Home', path: '/' }];

  let currentPath = '';
  pathnames.forEach((name, index) => {
    currentPath += `/${name}`;
    breadcrumbs.push({
      name: decodeURIComponent(name),
      path: currentPath
    });
  });

  return (
    <div className="flex items-center gap-2  text-xs">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const displayName =
          crumb.name === 'Home'
            ? crumb.name
            : crumb.name
                .replace(/-/g, ' ')
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

        return (
          <span key={crumb.path} className="flex items-center gap-2">
            {!isLast ? (
              <Link
                to={crumb.path}
                className=" hover:text-primary-focus font-medium transition-colors hover:text-primary"
              >
                {displayName}
              </Link>
            ) : (
              <span className="text-gray-900 font-semibold">{displayName}</span>
            )}
            {!isLast && <span className=" "> &gt;</span>}
          </span>
        );
      })}
    </div>
  );
};
