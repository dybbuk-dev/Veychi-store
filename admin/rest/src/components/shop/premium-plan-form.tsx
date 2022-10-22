import Input from '@components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@components/ui/button';
import Description from '@components/ui/description';
import Card from '@components/common/card';
import { useRouter } from 'next/router';
import { Shop, Tax } from '@ts-types/generated';
import { useCreateTaxClassMutation } from '@data/tax/use-tax-create.mutation';
import { useUpdateTaxClassMutation } from '@data/tax/use-tax-update.mutation';
import { useTranslation } from 'next-i18next';
import SelectInput from '@components/ui/select-input';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Loader from '@components/ui/loader/loader';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

const defaultValues = {
  domain: '',
  provider: 0,
  url: '',
  password: '',
  user: '',
};

type IProps = {
  shop: any;
  initialValues?: any | null;
};
export default function CreateOrUpdatePremiumInfoForm({
  initialValues,
  shop,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:
      {
        domain: shop.subscription.domain ?? '',
        url: shop.subscription.url ?? '',
        user: shop.subscription.user ?? '',
        password: shop.subscription.password ?? '',
        provider: shop.subscription.provider ?? '',
      } ?? defaultValues,
  });
  const onSubmit = async (values: any) => {
    if (initialValues) {
      /* updateTaxClass({
        variables: {
          id: initialValues.id!,
          input: {
            ...values,
          },
        },
      }); */
    } else {
      const tkn = Cookies.get('AUTH_CRED')!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      try {
        const creation = await axios.put(
          'premium-owner/' + shop.subscription.id,
          values,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        Swal.fire({
          title: t('common:text-perfect'),
          text: `<span> ${t(
            'common:successfully-updated'
          )}</span><br/><span>${t('common:text-help-domain-24-hours')}</span>`,
          icon: 'success',
          confirmButtonColor: '#5697FA',
          html: `<span> ${t(
            'common:successfully-updated'
          )}</span><br/><span>${t('common:text-help-domain-24-hours')}</span>`,
        }).then(() => {
          window.location.reload();
        });
      } catch (e) {}
    }
  };
  const cancelSubscription = async () => {
    try {
      const tkn = Cookies.get('AUTH_CRED')!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      const res = await axios.delete('premium-owner/' + shop.id, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      window.location.reload();
    } catch (e) {
    } finally {
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my sm:my-4">
        <Card className="w-full border-none shadow-none px-5 py-2">
          <Input
            label={
              t('form:input-label-domain') + ' ( Ej: https://example.com )'
            }
            {...register('domain')}
            error={t(errors.rate?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-domain-provider') + ' ( Ej: GoDaddy )'}
            {...register('provider')}
            error={t(errors.country?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={
              t('form:input-label-domain-provider-url') +
              ' ( Ej: https://www.godaddy.com )'
            }
            {...register('url')}
            error={t(errors.country?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={
              t('form:input-label-domain-user') + ' ( Ej: test@veychi.com )'
            }
            {...register('user')}
            error={t(errors.country?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-domain-password') + ' ( Ej: Test321 )'}
            {...register('password')}
            error={t(errors.country?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <span className="text-red-700 flex items-start  gap-2 mb-2 text-[0.95rem]">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mt-[0.20rem]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </span>
            <span className="mt-[0.1rem] text-red-500">
              <b>IMPORTANTE:</b> Una vez guardada la información, no se podrá
              cambiar.
              {/* <span className="mb-1 text-black">
                <br />* Registro: <b>Tipo A</b>
                <br />* Host: @
                <br />* Valor (apuntar al IP): <b>128.199.14.48</b>
                <br />* TTL: <b>3600</b> o <b>Automático</b>
              </span> */}
            </span>
          </span>
          <span className="text-red-700 flex items-start  gap-2 mb-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mt-[0.20rem]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </span>
            <span className="mb-1 text-red-500">
              Para que tu dominio funcione debes de agregar en tu zona de DNS
              del provedor de dominio web:
              {/* <span className="mb-1 text-black">
                <br />* Registro: <b>Tipo A</b>
                <br />* Host: @
                <br />* Valor (apuntar al IP): <b>128.199.14.48</b>
                <br />* TTL: <b>3600</b> o <b>Automático</b>
              </span> */}
            </span>
          </span>
          <ul className="mb-1 space-y-1 text-left text-gray-500 dark:text-gray-400">
            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#5697FA]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                />
              </svg>

              <span>
                Registro: <b>Tipo A</b>
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#5697FA]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                />
              </svg>

              <span>Host: @</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#5697FA]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                />
              </svg>

              <span>
                Valor (apuntar al IP): <b>128.199.14.48</b>
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#5697FA]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                />
              </svg>

              <span>
                TTL: <b>3600</b> o <b>Automático</b>
              </span>
            </li>
          </ul>
          <span className="pt-1 block"></span>
          <span className="text-red-700 flex items-start  gap-2 mb-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </span>
            <span className="mb-1 text-yellow-600">
              {t('common:text-help-domain-24-hours')}
            </span>
          </span>
          {/* <span className="mb-1">
            Para que tu dominio funcione debes de agregar un registro de
            tipo(Type) A, en el Nombre @ y valor colocamos la IP{' '}
            <b>128.199.14.48</b> TTL 3600
          </span> */}
        </Card>
      </div>

      <div className="mb-4 text-end flex justify-between pl-10">
        <Button
          loading={false}
          type="button"
          style={{ background: 'rgb(239 68 68)' }}
          className="bg-red-500"
          onClick={() => {
            Swal.fire(deleteSwalConfig as any).then(async (result) => {
              if (result.isDenied) {
                try {
                  cancelSubscription();
                } catch (e) {}
              }
            });
          }}
        >
          Cancelar Suscripción
        </Button>
        <Button loading={false}>Guardar</Button>
      </div>
    </form>
  );
}
export const deleteSwalConfig = {
  title: '¿Estás seguro que quieres borrar el plan?',
  icon: 'warning',
  showConfirmButton: false,
  showDenyButton: true,
  showCancelButton: true,
  denyButtonText: `Borrar Plan`,
  cancelButtonText: 'Cancelar',
};
