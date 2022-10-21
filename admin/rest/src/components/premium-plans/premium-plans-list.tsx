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
const PremiumSubscriptionsList = ({ taxes, onSort, onOrder }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft } = useIsRTL();
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

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 62,
    },
    {
      title: 'Tienda',
      dataIndex: 'shops',
      key: 'shops',
      align: 'center',
      render: (subscription: any) => {
        return <div>{subscription?.name}</div>;
      },
    },
    {
      title: 'Plan',
      dataIndex: 'plans',
      key: 'plans',
      align: 'center',
      render: (subscription: any) => {
        return <div>{subscription?.title}</div>;
      },
    },
    {
      title: 'Provedor',
      dataIndex: 'provider',
      key: 'provider',
      align: 'center',
    },
    {
      title: 'Dominio',
      dataIndex: 'domain',
      key: 'domain',
      align: 'center',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
    },
    {
      title: 'Fecha de fin',
      dataIndex: 'end_date',
      key: 'end_date',
      align: 'center',
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

export default PremiumSubscriptionsList;
export const deleteSwalConfig = {
  title: '¿Estás seguro que quieres borrar el token?',
  icon: 'warning',
  showConfirmButton: false,
  showDenyButton: true,
  showCancelButton: true,
  denyButtonText: `Borrar Token`,
  cancelButtonText: 'Cancelar',
};
