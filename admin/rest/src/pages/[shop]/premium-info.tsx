import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { useRouter } from 'next/router';
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
import { useEffect } from 'react';

export default function UpdateShopPage() {
  const { query } = useRouter();
  const { shop, redirect_status } = query;
  const { t } = useTranslation();
  const { data, isLoading: loading, error } = useShopQuery(shop as string);
  const [premium, setPremium] = useLocalStorage('premium', '');
  useEffect(() => {
    if (redirect_status) setPremium('true');
  }, [redirect_status]);
  if (loading) return <Loader text={t('common:text-loading')} />;
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
        <Card className="w-full sm:w-8/12 md:w-2/3">
          {premium === 'true' ? (
            <div className="flex flex-col items-center gap-2">
              <TaskAlt sx={{ color: 'green' }} />
              <h4 className="text-md font-semibold text-[#555]">
                Subscripción Activa
              </h4>
            </div>
          ) : (
            <ShopPremiumPayment />
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
