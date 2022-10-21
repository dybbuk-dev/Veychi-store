import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import router, { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@components/layouts/shop';
import { adminAndOwnerOnly } from '@utils/auth-utils';
import { useShopQuery } from '@data/shop/use-shop.query';
import Description from '@components/ui/description';
import Card from '@components/common/card';
import { TaskAlt, HighlightOff } from '@mui/icons-material';
import useLocalStorage from 'use-local-storage';
import { Button } from '@mui/material';
import ShopPremiumPayment from '@components/shop/shop-premium-info';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import PremiumPlanShower from '@components/shop/premium-plan-shower';
import CreateOrUpdatePremiumForm from '@components/premium-plans/tax-form';
import CreateOrUpdatePremiumInfoForm from '@components/shop/premium-plan-form';
import Swal from 'sweetalert2';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export interface Premium {
  id: number;
  title: string;
  price: number;
  duration: number;
  order: number;
  popular: true;
  traits: string[];
  created_at: string;
  updated_at: string;
  deleted_at: Date;
}
function delQuery(asPath: string) {
  return asPath.split('?')[0];
}
export default function UpdateShopPage() {
  const { query, ...router } = useRouter();
  const { shop, redirect_status } = query;
  const { t } = useTranslation();
  const {
    data: shopData,
    isLoading: loading,
    error,
  } = useShopQuery(shop as string);
  const [loadingCards, setLoadingCards] = useState(true);
  const [premiumCards, setPremiumCards] = useState<Premium[]>([]);
  const [selectedPremium, setSelectedPremium] = useState<null | Premium>(null);
  useEffect(() => {
    if (redirect_status === 'failed') {
      Swal.fire(
        'Ocurrió un error',
        'Error al procesar el pago, verifique sus credenciales o utilice otro método de pago.',
        'error'
      ).then((res) => {
        if (res.isConfirmed) {
          router.push(delQuery(router.asPath));
        }
      });
    }

    (async () => {
      const tkn = Cookies.get('AUTH_CRED')!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      try {
        const res = await axios.get('premium-plans', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        setPremiumCards(
          [...res.data.data].sort((a: Premium, b: Premium) => a.order - b.order)
        );
      } catch (e) {
      } finally {
        setLoadingCards(false);
      }
    })();
  }, []);
  if (loading || loadingCards)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-your-premium-subscription')}
        </h1>
      </div>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
        <Description
          title={t('form:shop-premium-status')}
          details={t('form:premium-info-helper-text')}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3 "
          style={{ paddingBottom: '5rem' }}
        >
          {shopData!.shop.plan ? (
            <CreateOrUpdatePremiumInfoForm shop={shopData!.shop} />
          ) : !selectedPremium ? (
            <>
              <PremiumPlanShower
                premiumCards={premiumCards}
                setSelectedPremium={setSelectedPremium}
              />
            </>
          ) : (
            <ShopPremiumPayment
              selectedPremium={selectedPremium}
              setSelectedPremium={setSelectedPremium}
              shopData={shopData as any}
            />
          )}
        </Card>
      </div>
    </>
  );
}
UpdateShopPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
UpdateShopPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});

const BecomePremium = () => {
  return <div></div>;
};
{
  /* <ShopPremiumPayment /> */
}
