import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { getAuth } from '@/auth';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { useState } from 'react';
import { ISpace, ISpaceUpdateRequest } from '@/services/interfaces/space.i.ts';
import { SpaceUpdateDialog } from '@/pages/views/space/SpaceUpdateDialog.tsx';

interface IBasicSettingsProps {
  title: string;
}

const SpaceSettings = ({ title }: IBasicSettingsProps) => {
  const { availableSpaces, activeSpace } = useSpace();
  const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleUpdateDialogOpen = (space: ISpace) => {
    setSelectedSpace(space);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setSelectedSpace(null);
    setIsUpdateDialogOpen(false);
  };

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            {availableSpaces.map((space) => (
              <tr key={space.id}>
                <td className="py-2 text-gray-700 font-normal">{space.spaceName} </td>

                <td className="py-2 text-gray-600 font-normal">
                  {activeSpace?.id === space?.id && (
                    <p className={'badge badge-sm badge-primary'}>Currently Active</p>
                  )}
                </td>

                <td className="py-2 text-end">
                  <div
                    onClick={() => handleUpdateDialogOpen(space)}
                    className="btn btn-sm btn-icon btn-clear btn-primary"
                  >
                    <KeenIcon icon="notepad-edit" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SpaceUpdateDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => handleUpdateDialogClose()}
        selectedSpace={selectedSpace}
      />
    </div>
  );
};

export { SpaceSettings, type IBasicSettingsProps };
