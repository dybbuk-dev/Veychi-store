import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateOrUpdateWithdrawForm from '@components/withdraw/withdraw-form';
import ShopLayout from '@components/layouts/shop';
import { adminAndOwnerOnly } from '@utils/auth-utils';
import Input from '@components/ui/input';
import Button from '@components/ui/button';
import Description from '@components/ui/description';
import Card from '@components/common/card';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
interface IBalance {
  id: number;
  payment_info: {
    name: string;
    email: string;
    bank: string;
    account: number;
  };
}
interface IShopInfo {
  name: string;
  id: number;
  balance: IBalance;
}
export default function CreateWithdrawPage() {
  const { shop = '' } = useRouter().query as { shop: string };
  const [data, setData] = useState<null | IShopInfo>(null);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  useEffect(() => {
    fetchShopData({ setter: setData, shop_slug: shop });
  }, []);

  const { t } = useTranslation();
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-withdraw')}
        </h1>
      </div>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8 justify-end">
        <Description
          title={t('form:shop-payment-info')}
          details={t('form:payment-info-helper-text')}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-account-holder-name')}
            name="holderName"
            variant="outline"
            value={data?.balance.payment_info.name}
            onChange={(e: any) =>
              setData((data: any) => {
                return {
                  ...data,
                  balance: {
                    ...data!.balance,
                    payment_info: {
                      ...data!.balance.payment_info,
                      name: e.target.value,
                    },
                  },
                };
              })
            }
            className="mb-5"
          />
          <Input
            label={t('form:input-label-account-holder-email')}
            name="email"
            variant="outline"
            value={data?.balance.payment_info.email}
            onChange={(e: any) =>
              setData((data: any) => {
                return {
                  ...data,
                  balance: {
                    ...data!.balance,
                    payment_info: {
                      ...data!.balance.payment_info,
                      email: e.target.value,
                    },
                  },
                };
              })
            }
            className="mb-5"
          />
          <Input
            label={t('form:input-label-bank-name')}
            name="bank"
            variant="outline"
            value={data?.balance.payment_info.bank}
            onChange={(e: any) =>
              setData((data: any) => {
                return {
                  ...data,
                  balance: {
                    ...data!.balance,
                    payment_info: {
                      ...data!.balance.payment_info,
                      bank: e.target.value,
                    },
                  },
                };
              })
            }
            className="mb-5"
          />
          <Input
            label={t('form:input-label-account-number')}
            type="number"
            name="account"
            variant="outline"
            value={data?.balance.payment_info.account}
            onChange={(e: any) =>
              setData((data: any) => {
                return {
                  ...data,
                  balance: {
                    ...data!.balance,
                    payment_info: {
                      ...data!.balance.payment_info,
                      account: parseInt(e.target.value || '0'),
                    },
                  },
                };
              })
            }
          />
        </Card>

        <Button
          variant="normal"
          className="mt-2 justify-self-end"
          type="button"
          loading={loadingUpdate}
          onClick={() =>
            handleInfoUpdate({
              data,
              shop_slug: shop,
              loadingUpdate: {
                loader: loadingUpdate,
                setter: setLoadingUpdate,
              },
            })
          }
        >
          {t('form:button-label-update')}
        </Button>
      </div>
      <CreateOrUpdateWithdrawForm />
    </>
  );
}
CreateWithdrawPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
CreateWithdrawPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
const fetchShopData = async ({
  setter,
  shop_slug,
}: {
  setter: React.Dispatch<React.SetStateAction<null | IShopInfo>>;
  shop_slug: string;
}) => {
  try {
    const tkn = Cookies.get('AUTH_CRED')!;
    if (!tkn) return;
    const { token } = JSON.parse(tkn);
    const res = await axios.get('shops/' + shop_slug, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    setter({
      name: res.data!.name,
      id: res.data!.id,
      balance: {
        id: res.data.balance.id,
        payment_info: {
          name: res.data.balance.payment_info.name,
          email: res.data.balance.payment_info.email,
          bank: res.data.balance.payment_info.bank,
          account: res.data.balance.payment_info.account,
        },
      },
    });
    console.log(res);
  } catch (error) {}
};
interface IShopUpdateProps {
  data: IShopInfo | null;
  shop_slug: string;
  loadingUpdate: {
    loader: boolean;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
const handleInfoUpdate = async ({
  data,
  shop_slug,
  loadingUpdate,
}: IShopUpdateProps) => {
  loadingUpdate.setter(true);
  try {
    if (!data) throw new Error();
    const tkn = Cookies.get('AUTH_CRED')!;
    if (!tkn) return;
    const { token } = JSON.parse(tkn);
    const res = await axios.put('shops/' + data!.id, data, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    toast.success('¡Actualizado Correctamente!');

    console.log(res);
  } catch (error) {
    Swal.fire('Ups!', 'No se pudo actualizar', 'error');
  } finally {
    loadingUpdate.setter(false);
  }
};
