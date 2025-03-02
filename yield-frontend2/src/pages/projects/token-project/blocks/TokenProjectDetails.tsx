import { Tab, TabPanel, Tabs, TabsList } from '@/components';
import { TokenProjectInfo } from './TokenProjectInfo';
import { ProjectDocumentTable } from './token-project-documents';

const TokenProjectDetails = () => {
  return (
    <Tabs defaultValue={1} className="">
      <TabsList className="justify-between px-5 mb-2">
        <div className="flex items-center gap-5">
          <Tab value={1}>Details</Tab>
          <Tab value={2}>Documents</Tab>
          <Tab value={3}>Tokenomics</Tab>
          <Tab value={4}>Allocations</Tab>
          <Tab value={5}>Investors</Tab>
        </div>
      </TabsList>
      <TabPanel value={1}>
        <TokenProjectInfo />
      </TabPanel>
      <TabPanel value={2}>
        <ProjectDocumentTable />
      </TabPanel>
      <TabPanel value={3}>Tokenomics</TabPanel>
      <TabPanel value={4}>Allocations</TabPanel>
      <TabPanel value={5}>Investors</TabPanel>
    </Tabs>
  );
};

export { TokenProjectDetails };
