import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon, MenuSeparator } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { ISponsorship } from '@/services/interfaces/sponsorships.i.ts';

import { useSponsor } from '@/pages/views/sponsors/SponsorContext.tsx';
import { deleteSponsor } from '@/services/sponsorship_services.ts';
import { useNavigate } from 'react-router';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';
import { useSpace } from '@/contexts/SpaceContext.tsx';

const Sponsors = () => {
  const [filter, setFilter] = useState<string>('');
  const [invoiceFilter, setInvoiceFilter] = useState<string>('');
  const [deckFilter, setDeckFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { activeSpace } = useSpace();

  const [filterData, setFilterData] = useState<ISponsorship[]>([]);
  const { fetchSponsors, sponsors, loading } = useSponsor();
  const [selectedSponsor, setSelectedSponsor] = useState<ISponsorship | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const handleOpenDeleteDialog = (selectedSponsor: ISponsorship) => {
    setSelectedSponsor(selectedSponsor);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSponsor(null);
  };

  const handleOpenUpdateDialog = (sponsor: ISponsorship) => {
    setSelectedSponsor(sponsor);
    navigate(`/sponsorships/update-sponsor`, { state: sponsor });
  };

  const handleSponsorDelete = async () => {
    const is_deleted: boolean = await deleteSponsor(selectedSponsor?.id);
    if (is_deleted) {
      fetchSponsors();
    }
  };

  // Filter logic
  useEffect(() => {
    let filteredByPermission = sponsors.filter((sponsor) => {
      if (activeSpace?.isAdmin) {
        return true;
      }
      return sponsor.assignedTo === auth?.user?.userId;
    });

    let filtered = [...filteredByPermission];
    if (filter.length) {
      filtered = filtered.filter(
        (sponsorship) =>
          sponsorship.organizationName.toLowerCase().includes(filter.toLowerCase()) ||
          sponsorship.eventName.toLowerCase().includes(filter.toLowerCase()) ||
          sponsorship.contactPerson.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Invoice filter
    if (invoiceFilter) {
      filtered = filtered.filter((sponsorship) =>
        invoiceFilter === 'true' ? sponsorship.invoiceSent : !sponsorship.invoiceSent
      );
    }

    // Deck filter
    if (deckFilter) {
      filtered = filtered.filter((sponsorship) =>
        deckFilter === 'true' ? sponsorship.deckSent : !sponsorship.deckSent
      );
    }

    // Payment filter
    if (paymentFilter) {
      filtered = filtered.filter((sponsorship) =>
        paymentFilter === 'true' ? sponsorship.paymentReceived : !sponsorship.paymentReceived
      );
    }

    setFilterData(filtered);
  }, [filter, sponsors, deckFilter, invoiceFilter, paymentFilter, auth?.user?.userId, activeSpace]);

  const columns = useMemo<ColumnDef<ISponsorship>[]>(
    () => [
      {
        accessorFn: (row) => row.organizationName,
        id: 'organization',
        header: () => 'Organization',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.eventName,
        id: 'event',
        header: () => 'Event',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.contactPerson,
        id: 'contact_person',
        header: () => 'Contact Person',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.contactEmail,
        id: 'contact_email',
        header: () => 'Contact Email',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.invoicePerson,
        id: 'invoice_person',
        header: () => 'Invoice Person',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.invoiceEmail,
        id: 'invoice_email',
        header: () => 'Invoice Email',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.commitmentAmount,
        id: 'commitment_amount',
        header: () => 'Commitment Amount',
        enableSorting: true,
        cell: (info) => (
          <p className={'text-sm'}>
            $
            {Number(info.getValue()).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </p>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.deckSent,
        id: 'deck_sent',
        header: () => 'Deck Sent',
        enableSorting: true,
        cell: (info) => (
          <div
            className={`badge badge-sm badge-outline  text-center ${info.getValue() ? 'badge-success' : 'badge-danger'}`}
          >
            {info.getValue() ? 'Yes' : 'No'}
          </div>
        ),
        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal text-center'
        }
      },
      {
        accessorFn: (row) => row.contractSent,
        id: 'contract_sent',
        header: () => 'Contract Sent',
        enableSorting: true,
        cell: (info) => (
          <div
            className={`badge badge-sm badge-outline text-center ${info.getValue() ? 'badge-success' : 'badge-danger'}`}
          >
            {info.getValue() ? 'Yes' : 'No'}
          </div>
        ),
        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal text-center'
        }
      },
      {
        accessorFn: (row) => row.invoiceSent,
        id: 'invoice_sent',
        header: () => 'Invoice Sent',
        enableSorting: true,
        cell: (info) => (
          <div
            className={`badge badge-sm badge-outline  text-center ${info.getValue() ? 'badge-success' : 'badge-danger'}`}
          >
            {info.getValue() ? 'Yes' : 'No'}
          </div>
        ),
        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal text-center'
        }
      },
      {
        accessorFn: (row) => row.paymentReceived,
        id: 'payment_received',
        header: () => 'Payment Received',
        enableSorting: true,
        cell: (info) => (
          <div
            className={`badge badge-sm badge-outline  text-center ${info.getValue() ? 'badge-success' : 'badge-danger'}`}
          >
            {info.getValue() ? 'Yes' : 'No'}
          </div>
        ),
        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal text-center'
        }
      },

      {
        id: 'actions',
        header: () => 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className={'flex flex-row items-center space-x-2'}>
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => handleOpenUpdateDialog(row.original)}
            >
              <KeenIcon icon={'pencil'} />
            </button>
            <MenuSeparator />
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => handleOpenDeleteDialog(row.original)}
            >
              <KeenIcon icon={'trash'} />
            </button>
          </div>
        ),
        meta: {
          className: 'w-[60px]'
        }
      }
    ],
    []
  );

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header flex-wrap gap-2">
        <h3 className="card-title font-medium text-sm">Sponsorships</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex flex-wrap gap-2.5 ">
            <div className={'flex flex-rows items-center gap-2 '}>
              <p className={'text-xs'}>Invoice:</p>
              <select
                className="select select-sm w-28"
                value={invoiceFilter}
                onChange={(event) => setInvoiceFilter(event.target.value)}
              >
                <option value="">All</option>
                <option value="true">Sent</option>
                <option value="false">Not Sent</option>
              </select>
            </div>
            <div className={'flex flex-rows items-center gap-2 '}>
              <p className={'text-xs'}>Deck:</p>
              <select
                className="select select-sm w-28"
                value={deckFilter}
                onChange={(event) => setDeckFilter(event.target.value)}
              >
                <option value="">All</option>
                <option value="true">Sent</option>
                <option value="false">Not Sent</option>
              </select>
            </div>

            <div className={'flex flex-rows items-center gap-2'}>
              <p className={'text-xs'}>Payment:</p>
              <select
                className="select select-sm w-28"
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
              >
                <option value="">All</option>
                <option value="true">Received</option>
                <option value="false">Not Received</option>
              </select>
            </div>

            <div className="flex">
              <label className="input input-sm">
                <KeenIcon icon="magnifier" />
                <input
                  placeholder="Search Sponsors"
                  type="text"
                  value={filter}
                  onChange={(event) => {
                    setFilter(event.target.value);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <DataGrid
          loading={loading}
          data={filterData}
          columns={columns}
          rowSelect={false}
          pagination={{ size: 5 }}
          sorting={[{ id: 'organization', desc: true }]}
        />
      </div>

      <DeleteSponsorDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleSponsorDelete}
      />
    </div>
  );
};

export { Sponsors };

export const DeleteSponsorDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}> = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      style={{ animation: 'fadeIn 0.3s ease' }}
      onClick={onClose}
    >
      <div
        className="dark:bg-neutral-950 dark:border-gray-50/15 dark:border bg-white rounded-lg p-6 w-full sm:w-96 md:w-1/2 lg:w-1/3 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800  items-center gap-2">
            <div className={'flex flex-col gap-2'}>
              <div className={'flex flex-row items-center gap-2 justify-start '}>
                <p>Remove Sponsor</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-2'}>
                You are about to remove a sponsor. This action cannot be undone.
              </p>
            </div>
          </h3>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="btn  btn-danger text-white w-1/2 items-center justify-center"
          >
            Remove Sponsor
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary text-gray-600  w-1/2 justify-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
