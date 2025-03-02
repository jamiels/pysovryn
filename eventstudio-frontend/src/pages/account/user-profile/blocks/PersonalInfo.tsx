import { KeenIcon } from '@/components';

import { CrudAvatarUpload } from '@/partials/crud';
import { getAuth, setAuth } from '@/auth';
import React, { useEffect, useState } from 'react';
import { changePassword, updateUser } from '@/services/user_services.ts';
import { IChangePassword } from '@/services/interfaces/users.i.ts';
import { showToast } from '@/utils/toast_helper.ts';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

const PersonalInfo = () => {
  const currentUser = getAuth()?.user;
  const [edit, setEdit] = useState('');
  const { saveAuthToState } = useAuth();

  const initialFormState = {
    name: currentUser?.name,
    email: currentUser?.email,
    password: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [password_form, setPasswordForm] = useState<IChangePassword>({
    oldpassword: '',
    newpassword: '',
    name: currentUser?.name as string
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({ ...password_form, [name]: value });
  };

  const handlePasswordSubmit = async () => {
    if (!password_form.oldpassword || !password_form.newpassword) {
      showToast('error', 'Both fields are required');
      return;
    }

    const result = await changePassword(password_form);

    if (result.success) {
      setEdit('');
      setPasswordForm({
        oldpassword: '',
        newpassword: '',
        name: currentUser?.name as string
      });
    }
  };

  const handleCancel = () => {
    setEdit('');
    setForm(initialFormState);
  };

  const handleUpdate = async () => {
    const updatedFields: any = {};
    Object.keys(form).forEach((key) => {
      if (
        form[key as keyof typeof form] !== initialFormState[key as keyof typeof initialFormState]
      ) {
        updatedFields[key] = form[key as keyof typeof form];
      }
    });

    if (Object.keys(updatedFields).length > 0) {
      const updatedUser = await updateUser(currentUser?.userId as number, updatedFields);
      if (updatedUser.id) {
        setEdit('');
        saveAuthToState({
          accessToken: getAuth()?.accessToken as string,
          refreshToken: getAuth()?.refreshToken as string,
          user: {
            userId: updatedUser.id || getAuth()?.user.userId,
            name: updatedUser.name || getAuth()?.user.name,
            email: updatedUser.email || getAuth()?.user.email,
            role: updatedUser.role || getAuth()?.user.role,
            updated_at: updatedUser.updated_at || getAuth()?.user.updated_at,
            created_at: updatedUser.created_at || getAuth()?.user.created_at,
            spaceId: getAuth()?.user.spaceId as number,
            profileImageURL: updatedUser.profileImageURL || getAuth()?.user.profileImageURL
          }
        });
      }
    }
  };

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Personal Info</h3>
        {edit != '' && !(edit === 'password') && (
          <div className={'flex gap-2 items-center'}>
            <button
              onClick={() => handleUpdate()}
              className={'btn btn-xs text-xs btn-primary items-center'}
            >
              Update
            </button>{' '}
            <button onClick={() => handleCancel()} className={'btn-xs btn-secondary btn-rounded'}>
              Cancel
            </button>
          </div>
        )}
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-28 text-gray-600 font-normal">Photo</td>
              <td className="py-2 text-gray700 font-normal min-w-32 text-2sm">
                150x150px JPEG, PNG Image
              </td>
              <td className="py-2 text-center">
                <div className="flex justify-center items-center">
                  <CrudAvatarUpload />
                </div>
              </td>
            </tr>
            <tr className={''}>
              <td className="py-2 text-gray-600  font-normal">Name</td>
              {edit === 'name' && (
                <div className={'py-2'}>
                  <input
                    name={'name'}
                    value={form.name}
                    onChange={handleInputChange}
                    className={'input '}
                    type={'text'}
                  />
                </div>
              )}
              {edit !== 'name' && (
                <td className="py-2 text-gray-800 font-normaltext-sm">{currentUser?.name}</td>
              )}
              <td className="py-2 text-center">
                <div
                  onClick={() => setEdit('name')}
                  className="btn btn-sm btn-icon btn-clear btn-primary"
                >
                  <KeenIcon icon="notepad-edit" />
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Email</td>
              {edit === 'email' && (
                <div className={'py-2'}>
                  <input
                    name={'email'}
                    value={form.email}
                    onChange={handleInputChange}
                    className={'input '}
                    type={'text'}
                  />
                </div>
              )}
              {edit !== 'email' && (
                <td className="py-2 text-gray-800 font-normaltext-sm">{currentUser?.email}</td>
              )}

              <td className="py-2 text-center">
                {/*<div*/}
                {/*  onClick={() => setEdit('email')}*/}
                {/*  className="btn btn-sm btn-icon btn-clear btn-primary"*/}
                {/*>*/}
                {/*  <KeenIcon icon="notepad-edit" />*/}
                {/*</div>*/}
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-600 font-normal">Password</td>
              <td className="py-3 text-gray-800 font-normal">
                {edit === 'password' && (
                  <div className="space-y-2">
                    <input
                      name="oldpassword"
                      value={password_form.oldpassword}
                      onChange={handlePasswordChange}
                      placeholder="Old password"
                      className="input w-full"
                      type="password"
                    />
                    <input
                      name="newpassword"
                      value={password_form.newpassword}
                      onChange={handlePasswordChange}
                      placeholder="New password"
                      className="input w-full"
                      type="password"
                    />

                    <div className="flex gap-2 mt-2">
                      <button onClick={handlePasswordSubmit} className="btn btn-sm btn-primary">
                        Confirm Change
                      </button>
                      <button
                        onClick={() => {
                          setEdit('');
                        }}
                        className="btn btn-sm btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {edit !== 'password' && (
                  <div onClick={() => setEdit('password')} className="btn btn-sm btn-secondary">
                    Change Password
                  </div>
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            {/*<tr>*/}
            {/*  <td className="py-3 text-gray-600 font-normal">Birthday</td>*/}
            {/*  <td className="py-3 text-gray-700 text-sm font-normal">28 May 1996</td>*/}
            {/*  <td className="py-3 text-center">*/}
            {/*    <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">*/}
            {/*      <KeenIcon icon="notepad-edit" />*/}
            {/*    </a>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            {/*<tr>*/}
            {/*  <td className="py-3 text-gray-600 font-normal">Gender</td>*/}
            {/*  <td className="py-3 text-gray-700 text-sm font-normal">Male</td>*/}
            {/*  <td className="py-3 text-center">*/}
            {/*    <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">*/}
            {/*      <KeenIcon icon="notepad-edit" />*/}
            {/*    </a>*/}
            {/*  </td>*/}
            {/*</tr>*/}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PersonalInfo };
