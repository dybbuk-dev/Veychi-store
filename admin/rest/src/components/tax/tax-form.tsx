import Input from '@components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@components/ui/button';
import Description from '@components/ui/description';
import Card from '@components/common/card';
import { useRouter } from 'next/router';
import { Tax } from '@ts-types/generated';
import { useCreateTaxClassMutation } from '@data/tax/use-tax-create.mutation';
import { useUpdateTaxClassMutation } from '@data/tax/use-tax-update.mutation';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { taxValidationSchema } from './tax-validation-schema';
import SelectInput from '@components/ui/select-input';
import axios from 'axios';
import Cookies from 'js-cookie';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

const defaultValues = {
  name: '',
  rate: 0,
  country: '',
  state: '',
  zip: '',
  city: '',
};

type IProps = {
  initialValues?: any | null;
};
export default function CreateOrUpdateTokenForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues ?? defaultValues,
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
        const creation = await axios.post(
          'approval-tokens',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        router.push('/es/shop-tokens');
        
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
              ? 'Edita la información de tu token'
              : 'Agrega la información de tu token'
          } `}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <SelectInput
            defaultValue={{ value: 'true', label: 'Activado' }}
            name="status"
            control={control}
            options={[
              { value: 'true', label: 'Activado' },
              { value: 'false', label: 'Desactivado' },
            ]}
          />
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

        <Button loading={false}>
          {initialValues ? 'Editar' : 'Agregar'} Token
        </Button>
      </div>
    </form>
  );
}
