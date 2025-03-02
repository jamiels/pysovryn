import { Fragment, useContext, useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';

import { useLayout, useLoaders } from '@/providers';
import { TokenProjectsContext } from '../providers';
import { TokenProjectContent } from './TokenProjectContent';
import { useParams } from 'react-router';
import { AddDocumentModal } from './blocks/add-document-modal';

const TokenProject = () => {
  const { currentLayout } = useLayout();
  const { setProgressBarLoader, progressBarLoader } = useLoaders();
  const { currentTokenProject, fetchTokenProject, reloadData } = useContext(TokenProjectsContext);
  const { id } = useParams();

  const [addDocumentModalOpen, setAddDocumentModalOpen] = useState(false);
  const handleAddDocumentModalClose = () => {
    setAddDocumentModalOpen(false);
  };

  useEffect(() => {
    getProjectToken();
  }, [reloadData]);

  const getProjectToken = async () => {
    if (id) {
      try {
        setProgressBarLoader(true);
        await fetchTokenProject(id).then(() => {
          setProgressBarLoader(false);
        });
      } catch (error: any) {
        console.log(error);
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
                <ToolbarPageTitle text={currentTokenProject?.name} />
              )}
            </ToolbarHeading>
            <ToolbarActions>
              <button className="btn btn-sm btn-light" disabled={progressBarLoader}>
                Edit
              </button>
              <button
                className="btn btn-sm btn-primary"
                disabled={progressBarLoader}
                onClick={() => setAddDocumentModalOpen(true)}
              >
                Add Document
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <TokenProjectContent />
      </Container>

      <Container>
        <AddDocumentModal open={addDocumentModalOpen} onClose={handleAddDocumentModalClose} />
      </Container>
    </Fragment>
  );
};

export { TokenProject };
