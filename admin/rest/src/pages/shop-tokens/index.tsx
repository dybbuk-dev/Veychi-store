import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
import Search from '@components/common/search';
import TaxList from '@components/tax/tax-list';
import ErrorMessage from '@components/ui/error-message';
import LinkButton from '@components/ui/link-button';
import Loader from '@components/ui/loader/loader';
import { useTaxesQuery } from '@data/tax/use-taxes.query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ROUTES } from '@utils/routes';
import { SortOrder } from '@ts-types/generated';
import TokenList from '@components/tokens/tax-list';
import axios from 'axios';
import Cookies from 'js-cookie';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function TokensPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearch] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const tkn = Cookies.get('AUTH_CRED')!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      try {
        const res = await axios.get('approval-tokens', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        setTokens(res.data.data);
      } catch (e) {}
    })();
  }, []);
  return (
    <>
      <Card className="flex flex-col xl:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading">Tokens</h1>
        </div>

        <div className="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 items-center ms-auto justify-end">
          <LinkButton
            href={`${ROUTES.TOKENS}/create`}
            className="h-12 w-full md:w-auto"
          >
            <span>+ Crear Token</span>
          </LinkButton>
        </div>
      </Card>
      {!loading ? (
        <TokenList taxes={tokens} onOrder={setOrder} onSort={() => {}} />
      ) : null}
    </>
  );
}
TokensPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
