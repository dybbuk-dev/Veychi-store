import Layout from '@components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateTaxForm from '@components/tax/tax-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { useTaxQuery } from '@data/tax/use-tax.query';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import CreateOrUpdateTokenForm from '@components/tokens/tax-form';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function UpdateTaxPage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tkn = Cookies.get('AUTH_CRED')!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      try {
        const creation = await axios.get('approval-tokens/' + query.id, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        setData(creation.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading || !data) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          Update Tax #{data?.id}
        </h1>
      </div>
      <CreateOrUpdateTokenForm initialValues={data} />
    </>
  );
}
UpdateTaxPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};
