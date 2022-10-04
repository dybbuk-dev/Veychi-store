import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import WithdrawList from '@components/withdraw/withdraw-list';
import { adminOnly } from '@utils/auth-utils';
import { useWithdrawsQuery } from '@data/withdraw/use-withdraws.query';
import { useState } from 'react';
import { SortOrder } from '@ts-types/generated';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';
import moment from 'moment';

export default function WithdrawsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {
    data,
    isLoading: loading,
    error,
  } = useWithdrawsQuery({
    limit: 10,
    page,
    sortedBy,
    orderBy,
  });

  const handleExport = async () => {
    try {
      const tkn = Cookies.get('AUTH_CRED')!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      const res = await axios.get(
        process.env.NEXT_PUBLIC_REST_API_ENDPOINT + 'withdraws/export/2/all',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      const dateNow = moment(new Date()).format('YYYY-DD-MM');
      saveXLSXData!(res.data, `retiros_${dateNow}.csv`);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center justify-between mb-8 w-full">
        <div className="flex items-center justify-content-between w-full">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:sidebar-nav-item-withdraws')}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Descargar
        </button>
      </Card>

      <WithdrawList
        withdraws={data?.withdraws}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
WithdrawsPage.authenticate = {
  permissions: adminOnly,
};
WithdrawsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
export const saveXLSXData = (function () {
  if (typeof document === 'undefined') return;
  const a = document.createElement('a');
  document.body.appendChild(a);
  //@ts-ignore
  a.style = 'display: none';
  return function (data: any, fileName: any) {
    const blob = new Blob([data], { type: 'octet/stream' }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();
