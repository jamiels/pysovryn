import { ChangeEvent, useContext, useRef, useState } from 'react';
import { Alert, KeenIcon } from '@/components';
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
  type: '',
  description: '',
  uploadDoc: '',
  passcode: ''
};

const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes

const addProjectSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(['Pitch Deck', 'Whitepaper'], 'Invalid type')
    .required('Type is required'),
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters')
    .required('Description is required'),
  uploadDoc: Yup.mixed<File>()
    .required('Document is required')
    .test(
      'fileType',
      'Only PDF files are allowed',
      (value: File) => value && value.type === 'application/pdf'
    )
    .test(
      'fileSize',
      'File size must not exceed 10 MB',
      (value) => value && value?.size <= maxFileSize
    ),
  passcode: Yup.string().max(20, 'Passcode cannot exceed 20 characters')
});

const AddDocumentModal = ({ open, onClose }: IModalProfileProps) => {
  const { currentTokenProject, triggerReloadData } = useContext(TokenProjectsContext);
  const parentRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: addProjectSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('projectId', currentTokenProject?.id);
        formData.append('type', values.type);
        formData.append('description', values.description);

        if (values.uploadDoc) {
          formData.append('file', values.uploadDoc); // Add the uploaded file
        }
        if (values.passcode) {
          formData.append('passcode', values.passcode);
        }

        await axios
          .post(`${import.meta.env.VITE_APP_API_URL}/files/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
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

  const handleFileOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    formik.handleBlur(e);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('uploadDoc', e.target.files?.[0] || null);
  };

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    console.log(formik.getFieldProps('uploadDoc'));

    setShowPassword(!showPassword);
  };

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
              <h1 className="text-xl font-semibold leading-none text-gray-900">Add Document</h1>
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
                          Type <span className="text-danger">*</span>
                        </label>
                        <div className="w-full">
                          <select
                            id="type"
                            {...formik.getFieldProps('type')}
                            className={'input bg-transparent'}
                          >
                            <option value="">Select a type</option>
                            <option value="Pitch Deck">Pitch Deck</option>
                            <option value="Whitepaper">Whitepaper</option>
                          </select>
                          {formik.touched.type && formik.errors.type && (
                            <span role="alert" className="text-danger text-xs mt-1">
                              {formik.errors.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">
                          Description <span className="text-danger">*</span>
                        </label>
                        <div className="w-full">
                          <input
                            type="text"
                            {...formik.getFieldProps('description')}
                            className={'input bg-transparent'}
                          />
                          {formik.touched.description && formik.errors.description && (
                            <span role="alert" className="text-danger text-xs mt-1">
                              {formik.errors.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">
                          Document <span className="text-danger">*</span>
                        </label>
                        <div className="w-full">
                          <input
                            type="file"
                            name="uploadDoc"
                            accept=".pdf"
                            onChange={handleFileChange}
                            onBlur={handleFileOnBlur}
                            className={'file-input'}
                          />
                          {formik.errors.uploadDoc && (
                            <span role="alert" className="text-danger text-xs mt-1">
                              {formik.errors.uploadDoc}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label flex items-center gap-1 max-w-56">
                          Passcode
                        </label>
                        <div className="w-full">
                          <label className="input">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="off"
                              {...formik.getFieldProps('passcode')}
                              className={clsx(
                                'form-control bg-transparent',
                                {
                                  'is-invalid': formik.touched.passcode && formik.errors.passcode
                                },
                                {
                                  'is-valid': formik.touched.passcode && !formik.errors.passcode
                                }
                              )}
                            />
                            <button className="btn btn-icon" onClick={togglePassword}>
                              <KeenIcon
                                icon="eye"
                                className={clsx('text-gray-500', { hidden: showPassword })}
                              />
                              <KeenIcon
                                icon="eye-slash"
                                className={clsx('text-gray-500', { hidden: !showPassword })}
                              />
                            </button>
                          </label>
                          {formik.touched.passcode && formik.errors.passcode && (
                            <span role="alert" className="text-danger text-xs mt-1">
                              {formik.errors.passcode}
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

export { AddDocumentModal };
