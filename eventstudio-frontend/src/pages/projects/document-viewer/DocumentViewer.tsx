import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';

import { useLayout, useLoaders } from '@/providers';
import { TokenProjectsContext } from '../providers';
import { useNavigate, useParams } from 'react-router';

import '@react-pdf-viewer/core/lib/styles/index.css';
import { AddDocumentModal } from './PasscodeModal';

const DocumentViewer = () => {
  const { currentLayout } = useLayout();
  const { setProgressBarLoader, progressBarLoader } = useLoaders();
  const { fetchProjectDocument, getDocumentDetails, currentTokenProject } =
    useContext(TokenProjectsContext);
  const { id } = useParams();
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [openPasscodeModal, setOpenPasscodeModal] = useState(false);
  const closePasscodeModal = () => {
    setOpenPasscodeModal(false);
  };
  const submitWithPassCode = (passcode: string) => {
    getProjectDocument(passcode);
  };

  useEffect(() => {
    getDocumentDetails(id || '').then((response) => {
      setTitle(`${response?.data?.projectName} (${response?.data?.fileName})`);

      console.log(currentTokenProject);

      if (response.data?.isPasscodeProtected) {
        setOpenPasscodeModal(true);
      } else {
        getProjectDocument('');
      }
    });
  }, []);

  const getProjectDocument = async (passcode: string) => {
    if (id) {
      try {
        setProgressBarLoader(true);

        await fetchProjectDocument(id, passcode).then((response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: 'application/pdf' })
          );
          setFileUrl(url);
          setProgressBarLoader(false);
          setOpenPasscodeModal(false);
        });
      } catch (error: any) {
        setStatus('Invalid Passcode');
        setProgressBarLoader(false);
        setOpenPasscodeModal(true);
      }
    }
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              {progressBarLoader ? (
                <div className="animate-pulse">
                  <div className="h1 bg-slate-200 rounded-lg w-[200px]  py-2"></div>
                  <div className="h5 bg-slate-200 rounded w-[150px] my-3 py-1"></div>
                </div>
              ) : (
                <ToolbarPageTitle text={title} />
              )}
            </ToolbarHeading>
            <ToolbarActions>
              {!!currentTokenProject?.id && (
                <button className="btn btn-sm btn-primary" onClick={() => navigate(-1)}>
                  Go back
                </button>
              )}
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div>
          {/* <h2>React PDF Viewer</h2> */}

          {/* File Upload */}
          {/* <input type="file" accept="application/pdf" onChange={handleFileChange} /> */}

          {/* PDF Viewer */}
          {fileUrl && (
            <div style={{ border: '1px solid #f1f1f4', borderRadius: '5px', height: '700px' }}>
              {/*        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={fileUrl} />
              </Worker>*/}
            </div>
          )}
        </div>
      </Container>

      <Container>
        <AddDocumentModal
          open={openPasscodeModal}
          status={status}
          onClose={closePasscodeModal}
          submitPasscode={submitWithPassCode}
        />
      </Container>
    </Fragment>
  );
};

export { DocumentViewer };
