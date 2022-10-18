import AdminLayout from '@components/layouts/admin';
import SettingsForm from '@components/settings/settings-form';
import SettingsLayoutImagesForm, {
  LayoutImage,
} from '@components/settings/settings-layout-images-form';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { useSettingsQuery } from '@data/settings/use-settings.query';
import { useShippingClassesQuery } from '@data/shipping/use-shippingClasses.query';
import { useTagsQuery } from '@data/tag/use-tags.query';
import { useTaxesQuery } from '@data/tax/use-taxes.query';
import { TagPaginator } from '@ts-types/generated';
import { adminOnly } from '@utils/auth-utils';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function Settings() {
  const { t } = useTranslation();
  const { data: taxData, isLoading: taxLoading } = useTaxesQuery();
  const { data: ShippingData, isLoading: shippingLoading } =
    useShippingClassesQuery();
  const { data: tags = null } = useTagsQuery({
    limit: 999,
  });
  const [imagesData, setImagesData] = useState<LayoutImage[] | null>(null);
  const { data, isLoading: loading, error } = useSettingsQuery();

  useEffect(() => {
    (async () => {
      try {
        const tkn = Cookies.get('AUTH_CRED')!;
        if (!tkn) return;
        const { token } = JSON.parse(tkn);
        const res = await axios.get('marketing', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        setImagesData(res.data.data.slice(0, 9));
      } catch (e) {}
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
      {imagesData && tags && (
        <SettingsLayoutImagesForm imagesData={imagesData} tags={tags} />
      )}
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
