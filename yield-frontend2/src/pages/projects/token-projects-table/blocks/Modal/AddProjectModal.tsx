import { useContext, useRef, useState } from 'react';
import { Alert } from '@/components';
import { Modal, ModalContent, ModalBody, ModalHeader } from '@/components/modal'; // Import your custom Modal component

import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import axios from 'axios';
import { TokenProjectsContext } from '@/pages/projects/providers';

interface IModalProfileProps {
  open: boolean;
  onClose: () => void;
}

const initialValues = {
  projectName: '',
  tokenSymbol: '',
  projectURL: ''
};

const addProjectSchema = Yup.object().shape({
  projectName: Yup.string().required('Project Name is required'),
  tokenSymbol: Yup.string(),
  projectURL: Yup.string().url('Invalid URL format')
});

const AddProjectModal = ({ open, onClose }: IModalProfileProps) => {
  const { triggerReloadData } = useContext(TokenProjectsContext);

  const parentRef = useRef<any | null>(null);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: addProjectSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        await axios
          .post<any>(`${import.meta.env.VITE_APP_API_URL}/projects/add`, {
            name: values?.projectName,
            symbol: values?.tokenSymbol,
            projectUrl: values?.projectURL
          })
          .then(() => {
            setLoading(false);
            triggerReloadData();
            closeModal();
          });
      } catch (error: any) {
        setStatus(error?.message);
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const closeModal = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="container-fixed px-30 overflow-hidden pt-7.5 my-[10%] w-full">
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Add Project</h1>
            </div>
            <button className="btn btn-sm btn-light" onClick={closeModal}>
              Close
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="flex grow gap-5 lg:gap-7.5">
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
              <div className="card pb-2.5">
                <form
                  className="card-body flex flex-col items-center gap-5 p-10"
                  noValidate
                  onSubmit={formik.handleSubmit}
                >
                  {formik.status && <Alert variant="danger">{formik.status}</Alert>}

                  <div className="card-body grid gap-5 w-3/4">
                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">
                          Project Name
                          <span className="text-danger">*</span>
                        </label>
                        <div className="w-full">
                          <input
                            type="text"
                            {...formik.getFieldProps('projectName')}
                            className={clsx('input bg-transparent')}
                          />
                          {formik.touched.projectName && formik.errors.projectName && (
                            <span role="alert" className="text-danger text-xs mt-1">
                              {formik.errors.projectName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">
                          Token Symbol
                        </label>
                        <input
                          type="text"
                          {...formik.getFieldProps('tokenSymbol')}
                          className={'input bg-transparent'}
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">
                          Project URL
                        </label>
                        <div className="w-full">
                          <input
                            type="url"
                            {...formik.getFieldProps('projectURL')}
                            className={'input bg-transparent'}
                          />
                          {formik.touched.projectURL && formik.errors.projectURL && (
                            <span role="alert" className="text-danger text-xs mt-1">
                              {formik.errors.projectURL}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2.5">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || formik.isSubmitting}
                      >
                        {loading ? 'Please wait...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { AddProjectModal };
