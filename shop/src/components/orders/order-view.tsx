import dayjs from 'dayjs';
import Link from '@components/ui/link';
import usePrice from '@lib/use-price';
import { formatAddress } from '@lib/format-address';
import { formatString } from '@lib/format-string';
import { ROUTES } from '@lib/routes';
import { useTranslation } from 'next-i18next';
import Badge from '@components/ui/badge';
import { OrderItems } from '@components/orders/order-items';
import SuborderItems from '@components/orders/suborder-items';
import Button from '@components/ui/button';
import Swal from 'sweetalert2';
import { useMemo } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function OrderView({ order }: any) {
  const { t } = useTranslation('common');

  const { price: total } = usePrice({ amount: order?.paid_total! });
  const { price: sub_total } = usePrice({ amount: order?.amount! });
  const { price: shipping_charge } = usePrice({
    amount: order?.delivery_fee ?? 0,
  });
  const { price: tax } = usePrice({ amount: order?.sales_tax ?? 0 });
  const { price: discount } = usePrice({ amount: order?.discount ?? 0 });
  const router = useRouter();
  console.log({ order });
  const activeDispute = useMemo(() => {
    return order?.children[0]?.dispute?.find(
      (dispute: any) => dispute.status === 'opened'
    );
  }, [order]);
  return (
    <div className="max-w-[1280px] mx-auto mb-14 lg:mb-16">
      <div className="w-full mx-auto shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="mt-5 sm:mt-0 ltr:mr-auto rtl:ml-auto order-2 sm:order-1 text-heading font-semibold flex items-center">
            {t('text-status')} :
            <Badge
              text={order?.status?.name!}
              className="whitespace-nowrap bg-heading text-white font-semibold text-sm ltr:ml-2 rtl:mr-2"
            />
            {activeDispute ? (
              <Button
                onClick={() =>
                  router.push(
                    '/dispute/' +
                      activeDispute.id +
                      `?tracking_number=${order!.tracking_number}`
                  )
                }
                variant="normal"
              >
                <Badge
                  text={'Ver Reclamo'}
                  className="whitespace-nowrap bg-red-500 text-white font-semibold text-[11px] ltr:ml-2 rtl:mr-2 hover:bg-red-300 cursor-pointer"
                />
              </Button>
            ) : (
              <Button
                variant="normal"
                className="ml-4 text-red-600 "
                onClick={() => {
                  Swal.fire(deleteSwalConfig as any).then(async (result) => {
                    if (result.isDenied) {
                      try {
                        const token = Cookies.get('auth_token')!;
                        if (!token) return;

                        const res = await axios.post(
                          '/dispute/' + order.id,
                          {},
                          {
                            headers: {
                              Authorization: 'Bearer ' + token,
                            },
                          }
                        );
                        router.push('/dispute/' + res.data.id);
                      } catch (e) {}
                    }
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </Button>
            )}
          </div>

          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center text-heading order-1 sm:order-2 text-accent text-base font-semibold underline hover:no-underline"
          >
            {t('text-back-to-home')}
          </Link>
        </div>

        <div className="grid gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-11">
          <div className="p-5 md:p-6 border border-gray-100 bg-gray-200 rounded-md shadow-sm">
            <h3 className="mb-2 text-base text-heading font-semibold">
              {t('text-order-number')}
            </h3>
            <p className="text-sm text-body">{order?.tracking_number}</p>
          </div>
          <div className="p-5 md:p-6 border border-gray-100 bg-gray-200 rounded-md shadow-sm">
            <h3 className="mb-2 text-base text-heading font-semibold">
              {t('text-date')}
            </h3>
            <p className="text-sm text-body">
              {dayjs(order?.created_at).format('MMMM D, YYYY')}
            </p>
          </div>
          <div className="p-5 md:p-6 border border-gray-100 bg-gray-200 rounded-md shadow-sm">
            <h3 className="mb-2 text-base text-heading font-semibold">
              {t('text-total')}
            </h3>
            <p className="text-sm text-body">{total}</p>
          </div>
          <div className="p-5 md:p-6 border border-gray-100 bg-gray-200 rounded-md shadow-sm">
            <h3 className="mb-2 text-base text-heading font-semibold">
              {t('text-payment-method')}
            </h3>
            <p className="text-sm text-body">
              {order?.payment_gateway ?? 'N/A'}
            </p>
          </div>
        </div>
        {/* end of order received  */}

        <div className="flex flex-col md:flex-row border border-gray-100 rounded-md">
          <div className="w-full md:w-1/2 ltr:md:pr-3 rtl:md:pl-3 border-r px-5 lg:px-7 py-6 lg:py-7 xl:py-8 border-gray-100">
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-heading mb-5 lg:mb-6">
              {t('text-total-amount')}
            </h2>
            <div className="space-y-4 lg:space-y-5">
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-sub-total')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">
                  {sub_total}
                </span>
              </p>
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-shipping-charge')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">
                  {shipping_charge}
                </span>
              </p>
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-tax')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">{tax}</span>
              </p>
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-discount')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">
                  {discount}
                </span>
              </p>
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-total')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">
                  {total}
                </span>
              </p>
            </div>
          </div>
          {/* end of total amount */}

          <div className="w-full md:w-1/2 px-5 lg:px-7 py-6 lg:py-7 xl:py-8">
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-heading mb-5 lg:mb-6">
              {t('text-order-details')}
            </h2>
            <div className="space-y-4 lg:space-y-5">
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-total-item')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7 capitalize">
                  {formatString(order?.products?.length, t('text-item'))}
                </span>
              </p>
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-deliver-time')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">
                  {order?.delivery_time}
                </span>
              </p>
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-shipping-address')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">
                  {formatAddress(order?.shipping_address!)}
                </span>
              </p>
              <p className="flex text-body text-sm lg:text-[15px] xl:text-base mb-0">
                <strong className="w-1/2 md:w-4/12 ltr:pr-4 rtl:pl-4 text-heading font-semibold">
                  {t('text-billing-address')}
                </strong>
                :
                <span className="w-1/2 md:w-8/12 ltr:pl-7 rtl:pr-7">
                  {formatAddress(order?.billing_address!)}
                </span>
              </p>
            </div>
          </div>
          {/* end of order details */}
        </div>

        <div className="mt-11">
          <OrderItems products={order?.products} />
        </div>
        {order?.children?.length ? (
          <div className="mt-11">
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-heading mb-3 lg:mb-5 xl:mb-6">
              {t('text-sub-orders')}
            </h2>
            <div>
              <div className="flex items-start mb-6">
                <p className="text-heading text-sm leading-6">
                  <span className="font-bold">{t('text-note')}:</span>{' '}
                  {t('text-message-sub-order')}
                </p>
              </div>
              {Array.isArray(order?.children) && order?.children.length && (
                <SuborderItems items={order?.children} />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const deleteSwalConfig = {
  title: '¿Estás seguro que quieres abrir un reclamo?',
  icon: 'warning',
  showConfirmButton: false,
  showDenyButton: true,
  showCancelButton: true,
  denyButtonText: `Abrir Reclamo`,
  cancelButtonText: 'Cancelar',
};
