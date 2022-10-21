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
        window.location.reload();
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
      <div className="flex flex-wrap my-2 sm:my-4">
        <Card className="w-full border-none shadow-none">
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
        <Button loading={false}>Editar Información</Button>
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
