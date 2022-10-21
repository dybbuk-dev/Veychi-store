import Input from '@components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@components/ui/button';
import Description from '@components/ui/description';
import Card from '@components/common/card';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Tax } from '@ts-types/generated';
import { useCreateTaxClassMutation } from '@data/tax/use-tax-create.mutation';
import { useUpdateTaxClassMutation } from '@data/tax/use-tax-update.mutation';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { taxValidationSchema } from './tax-validation-schema';
import SwitchInput from '@components/ui/switch-input';
import axios from 'axios';
import Cookies from 'js-cookie';

const defaultValues = {
  name: '',
  rate: 0,
  country: '',
  state: '',
  zip: '',
  city: '',
};

type IProps = {
  initialValues?: Tax | null;
};
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function CreateOrUpdatePremiumForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [counter, setCounter] = useState(1);
  const inputs = new Array(counter).fill(' ');
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUnregister: true,
    defaultValues: {},
  });
  const onSubmit = async ({
    duration,
    order,
    price,
    title,
    popular,
    ...rest
  }: any) => {
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
      const entries = Object.entries(rest).map(([k, v]: any) => v);
      const newValues = {
        duration,
        order,
        price,
        title,
        popular,
        traits: entries,
      };
      if (!tkn) return;
      const { token } = JSON.parse(tkn);
      try {
        const creation = await axios.post('premium-plans', newValues, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        router.push('/es/premium-plans');
      } catch (e) {}
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={`${
            initialValues
              ? t('form:item-description-update')
              : t('form:item-description-add')
          } ${t('form:premium-form-info-help-text')}`}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-title')}
            {...register('title', { required: 'Name is required' })}
            required
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-price')}
            {...register('price')}
            type="number"
            error={t(errors.rate?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-duration-in-days')}
            type="number"
            {...register('duration')}
            error={t(errors.country?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-order')}
            type="number"
            {...register('order')}
            error={t(errors.city?.message!)}
            required
            variant="outline"
            className="mb-5"
          />
          <SwitchInput
            label={
              <label className="block text-body-dark font-semibold text-sm leading-none my-3">
                Popular?
              </label>
            }
            errors={t(errors.serial?.message!)}
            name="popular"
            control={control}
          />
          {inputs.map((_, i) => (
            <Input
              label={'Rasgo' + ' ' + (i + 1)}
              {...register('trait' + i)}
              error={t(errors.zip?.message!)}
              required
              variant="outline"
              className="mb-5"
            />
          ))}
          <div className="flex gap-2">
            <button onClick={() => setCounter((counter) => counter + 1)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {counter > 1 && (
              <button onClick={() => setCounter((counter) => counter - 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

        <Button>
          {initialValues
            ? t('form:button-label-update')
            : t('form:button-label-add')}{' '}
          Plan
        </Button>
      </div>
    </form>
  );
}
