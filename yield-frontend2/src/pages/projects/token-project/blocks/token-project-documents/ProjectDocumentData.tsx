interface IDocumentsData {
  description: string;
  fileName: string;
  fileSize: number;
  id: string;
  internalVersion: number;
  lastUpdated: string;
  passcode: string | null;
  type: string;
  uploadTime: string;
  views: number;
}

const DocumentsData: IDocumentsData[] = [
  {
    description: 'Testing',
    fileName: 'workflow.pdf',
    fileSize: 958057,
    id: '9a72312f-8f1e-4434-97fe-286e51dc98c9',
    internalVersion: 1,
    lastUpdated: '2024-11-22T03:16:11.687029',
    passcode: null,
    type: 'Pitch Deck',
    uploadTime: '2024-11-22T03:16:11.687029',
    views: 0
  },
  {
    description: 'Testing',
    fileName: 'workflow.pdf',
    fileSize: 958057,
    id: '6c265291-5738-42d5-a325-a5a6b82d14e4',
    internalVersion: 1,
    lastUpdated: '2024-11-22T03:18:07.428515',
    passcode: null,
    type: 'Pitch Deck',
    uploadTime: '2024-11-22T03:18:07.428515',
    views: 0
  }
];

export { DocumentsData, type IDocumentsData };
