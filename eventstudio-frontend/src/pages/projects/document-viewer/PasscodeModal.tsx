import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { Alert, KeenIcon } from '@/components';
import { Modal, ModalContent, ModalBody, ModalHeader } from '@/components/modal'; // Import your custom Modal component

import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import { TokenProjectsContext } from '@/pages/projects/providers';
import { useLocation, useNavigate } from 'react-router';

interface IModalProfileProps {
  open: boolean;
  status: string;
  onClose: () => void;
  submitPasscode: (passcode: string) => void;
}

const initialValues = {
  passcode: ''
};

const addProjectSchema = Yup.object().shape({
  passcode: Yup.string().required().max(20, 'Passcode cannot exceed 20 characters')
});

const AddDocumentModal = ({ status, open, onClose, submitPasscode }: IModalProfileProps) => {
  const parentRef = useRef<any | null>(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: addProjectSchema,
    onSubmit: async (values) => {
      setLoading(true);
      submitPasscode(values?.passcode);
      formik.resetForm();
      setLoading(false);
      onClose();
    }
  });

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setShowPassword(!showPassword);
  };

  const closeModal = () => {
    formik.resetForm();
    onClose();
    navigate(-1);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="container-fixed px-30 overflow-hidden pt-7.5 my-[10%] w-1/2">
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Enter Passcode</h1>
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
                  <div className="w-3/4">{status && <Alert variant="danger">{status}</Alert>}</div>

                  <div className="card-body grid gap-5 w-3/4">
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
