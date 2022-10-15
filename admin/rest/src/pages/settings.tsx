import AdminLayout from '@components/layouts/admin';
import SettingsForm from '@components/settings/settings-form';
import SettingsLayoutImagesForm, {
  LayoutImage,
} from '@components/settings/settings-layout-images-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { useSettingsQuery } from '@data/settings/use-settings.query';
import { useShippingClassesQuery } from '@data/shipping/use-shippingClasses.query';
import { useTaxesQuery } from '@data/tax/use-taxes.query';
import { adminOnly } from '@utils/auth-utils';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

export default function Settings() {
  const { t } = useTranslation();
  const { data: taxData, isLoading: taxLoading } = useTaxesQuery();
  const { data: ShippingData, isLoading: shippingLoading } =
    useShippingClassesQuery();
  const [imagesData, setImagesData] = useState<LayoutImage[]>([]);
  const { data, isLoading: loading, error } = useSettingsQuery();
  useEffect(() => {
    (async () => {
      const tkn = Cookies.get('AUTH_CRED')!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      const res = await axios.get('marketing', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      console.log(res);
    })();
  }, []);
  if (loading || shippingLoading || taxLoading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-settings')}
        </h1>
      </div>
      <SettingsForm
        settings={data?.options}
        taxClasses={taxData?.taxes}
        shippingClasses={ShippingData?.shippingClasses}
      />
      <SettingsLayoutImagesForm imagesData={imagesData} />
    </>
  );
}
Settings.authenticate = {
  permissions: adminOnly,
};
Settings.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
