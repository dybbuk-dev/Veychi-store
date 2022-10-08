import Button from '@components/ui/button';
import Input from '@components/ui/input';
import PasswordInput from '@components/ui/password-input';
import { useForm } from 'react-hook-form';
import Card from '@components/common/card';
import Description from '@components/ui/description';
import { useCreateUserMutation } from '@data/user/use-user-create.mutation';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from '../user/user-validation-schema';
import SelectInput from '@components/ui/select-input';

type FormValues = {
  name: string;
  email: string;
  password: string;
  salary: number;
  permission: string;
  line_of_business: string;
  physical_address: string;
  fiscal_address: string;
  tax_country: string;
  business_phone: string;
  products_description: string;
  legal_representative: LegalRepresentative;
  dni_document: dni_document;
};
type dni_document = {
  DNI: string;
  DNI_document_path: string;
};

type LegalRepresentative = {
  name: string;
  phone: string;
};

const defaultValues = {
  email: '',
  password: '',
  salary: 0,
  permission: 'staff',
};

const AdministratorCreateForm = () => {
  const { t } = useTranslation();
  const { mutate: registerUser, isLoading: loading } = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    setError,
    control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  async function onSubmit({
    name,
    email,
    password,
    salary,
    permission,
  }: FormValues) {
    registerUser(
      {
        variables: {
          salary,
          name,
          email,
          password,
          permission,
        },
      },
      {
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: 'manual',
              message: error?.response?.data[field][0],
            });
          });
        },
      }
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-text')}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
          />
          <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-4"
          />
          <Input
            label={t('form:input-label-salary')}
            {...register('salary')}
            type="number"
            variant="outline"
            className="mb-4"
            error={t(errors.salary?.message!)}
          />
          <SelectInput
            defaultValue={{ value: 'staff', label: 'Staff' }}
            name="permission"
            control={control}
            options={[
              { value: 'shareholder', label: 'Accionista' },
              { value: 'CEO', label: 'CEO' },
              { value: 'manager_rh', label: 'Manager RH' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'management', label: 'Administración' },
              { value: 'legal', label: 'Legal' },
            ]}
          />
          <h2 className="block text-body-dark font-semibold text-sm leading-none mb-3 mt-4">
            Contrato:
          </h2>
          <input id="fileSelect" type="file" accept=".pdf" />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-create-administrator')}
        </Button>
      </div>
    </form>
  );
};

export default AdministratorCreateForm;
