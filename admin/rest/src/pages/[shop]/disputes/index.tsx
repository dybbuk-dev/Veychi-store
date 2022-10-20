import Card from '@components/common/card';
import AttributeList from '@components/attribute/attribute-list';
import Loader from '@components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@components/layouts/shop';
import { useRouter } from 'next/router';
import { adminOwnerAndStaffOnly } from '@utils/auth-utils';
import { useEffect, useState } from 'react';
import DisputeList from '@components/attribute/dispute-list';
import { Order } from '@ts-types/generated';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useShopQuery } from '@data/shop/use-shop.query';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function AttributePage() {
  const {
    query: { shop },
  } = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const { data: shopData, isLoading: fetchingShop } = useShopQuery(
    shop as string
  );
  console.log(shopData);
  console.log('entrd');
  useEffect(() => {
    if (!shopData) return;
    (async () => {
      try {
        const tkn = Cookies.get('AUTH_CRED')!;
        if (!tkn) return;
        const { token } = JSON.parse(tkn);
        const res: any = await axios.get(
          'orders?limit=0&shop_id=' + shopData.shop.id!,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        setOrders(
          res.data.data.filter((order: any) =>
            order.dispute.some((dispute: any) => dispute.status === 'opened')
          )
        );
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [shopData]);

  if (loading || fetchingShop)
    return <Loader text={t('common:text-loading')} />;
  /*  if (error) return <ErrorMessage message={error.message} />; */
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:sidebar-nav-item-disputes')}
          </h1>
        </div>
      </Card>
      <DisputeList data={orders} />
    </>
  );
}
AttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
AttributePage.Layout = ShopLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
