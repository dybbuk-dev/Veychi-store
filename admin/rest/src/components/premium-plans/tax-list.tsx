import { Table } from '@components/ui/table';
import ActionButtons from '@components/common/action-buttons';
import { SortOrder, Tax } from '@ts-types/generated';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@utils/locals';
import { useState } from 'react';
import TitleWithSort from '@components/ui/title-with-sort';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import moment from 'moment';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export type IProps = {
  taxes: any[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const PremiumList = ({ taxes, onSort, onOrder }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft } = useIsRTL();
  console.log({ taxes });
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });
  console.log({ taxes });
  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 62,
    },
    {
      title: 'Órden',
      dataIndex: 'order',
      key: 'order',
      align: 'center',
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: 'Popular',
      dataIndex: 'popular',
      key: 'popular',
      align: 'center',
      render: (id: boolean) => {
        return <div>{id ? 'Sí' : 'No'}</div>;
      },
    },
    {
      title: 'Rasgos',
      dataIndex: 'id',
      key: 'traits',
      align: 'center',
      render: (id: string) => {
        const foundPlan = taxes!.find((tax: any) => tax.id == id)!;
        const parsedTraits = foundPlan.traits;
        return (
          <div>
            {parsedTraits.map((trait: any) => (
              <div> - {trait || ''} </div>
            ))}
          </div>
        );
      },
      width: 200,
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      render: (id: string) => (
        <div className="flex items-center justify-center gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              Swal.fire(deleteSwalConfig as any).then(async (result) => {
                if (result.isDenied) {
                  try {
                    const tkn = Cookies.get('AUTH_CRED')!;
                    if (!tkn) return;
                    const { token } = JSON.parse(tkn);

                    const res = await axios.delete(
                      '/premium-plans/' + id,

                      {
                        headers: {
                          Authorization: 'Bearer ' + token,
                        },
                      }
                    );
                    window.location.reload();
                  } catch (e) {}
                }
              });
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>

          {/*  <ActionButtons id={id} editUrl={`${ROUTES.PREMIUMPLANS}/edit/${id}`} /> */}
        </div>
      ),
      width: 200,
    },
  ];
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table
        columns={columns as any}
        emptyText={t('table:empty-table-data')}
        data={taxes}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default PremiumList;
export const deleteSwalConfig = {
  title: '¿Estás seguro que quieres borrar el plan?',
  icon: 'warning',
  showConfirmButton: false,
  showDenyButton: true,
  showCancelButton: true,
  denyButtonText: `Borrar Plan`,
  cancelButtonText: 'Cancelar',
};
