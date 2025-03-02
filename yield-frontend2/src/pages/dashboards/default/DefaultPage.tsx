import { useLayout } from '@/providers';
import { Dashboard } from '../';

const DefaultPage = () => {
  const { currentLayout } = useLayout();

  if (currentLayout?.name === 'demo1-layout') {
    return <Dashboard />;
  }
};

export { DefaultPage };
