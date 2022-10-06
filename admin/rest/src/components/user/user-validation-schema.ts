import * as yup from 'yup';
export const customerValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  salary: yup.number().required('form:error-email-salary'),
  password: yup.string().required('form:error-password-required'),
  permission: yup.object().optional(),
});
