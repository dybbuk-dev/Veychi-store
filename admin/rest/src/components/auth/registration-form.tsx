import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
import Link from "@components/ui/link";
import { allowedRoles, hasAccess, setAuthCredentials } from "@utils/auth-utils";
// import { Permission } from "@ts-types/generated";
import { useRegisterMutation } from "@data/user/use-register.mutation";
import { FormValues } from "@ts-types/generated";
import axios from "axios";

const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
  } = useForm<any>();
  const router = useRouter();
  const { t } = useTranslation();

  const formValidationError = () => {
    return (
      Object.values(getValues()).includes("") ||
      Object.values(getValues().company).includes("") ||
      Object.values(getValues().company.dni_document).includes("") ||
      Object.values(getValues().company.legal_representative).includes("")
    );
  };

  async function onSubmit(values: any) {
    if (formValidationError()) {
      alert("Please fill all the fields");
      return;
    }
    if (
      values.company.dni_document.DNI_image.length !== 1 ||
      values.company.legal_representative.dni_document.DNI_image.length !== 1
    ) {
      alert("Please upload DNI images");
      return;
    }
    let parsedValues = { ...values };
    const [firstDni, secondDni] = await Promise.all([
      getBase64(values.company.dni_document.DNI_image[0]),
      getBase64(values.company.legal_representative.dni_document.DNI_image[0]),
    ]);

    parsedValues.company.dni_document.DNI_image = firstDni;
    parsedValues.company.legal_representative.dni_document.DNI_image =
      secondDni;

    parsedValues.permission = "store_owner";

    registerUser(
      {
        variables: parsedValues as FormValues.RootObject,
      },

      {
        onSuccess: ({ data }) => {
          if (data?.token) {
            if (hasAccess(allowedRoles, data?.permissions)) {
              setAuthCredentials(data?.token, data?.permissions);
              router.push(ROUTES.DASHBOARD);
              return;
            }
            setErrorMessage("form:error-enough-permission");
          } else {
            setErrorMessage("form:error-credential-wrong");
          }
        },
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: error?.response?.data[field],
            });
          });
        },
      }
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-wrap gap-2 justify-center items-center flex-col rounded-[20px] "
        style={{ border: "1px solid rgba(0,0,0,0.2)", padding: "1rem" }}
      >
        <Input
          label={t("form:input-label-name")}
          {...register("name")}
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.name?.message!)}
        />
        <Input
          label={t("form:input-label-email")}
          {...register("email")}
          type="email"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <PasswordInput
          label={t("form:input-label-password")}
          {...register("password")}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
        />
        <Input
          label={t("form:input-label-company-name")}
          {...register("company.name")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-line-of-business")}
          {...register("company.line_of_business")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-tax-country")}
          {...register("company.tax_country")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-business-phone")}
          {...register("company.business_phone")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-products-description")}
          {...register("company.products_description")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-legal-representative-DNI")}
          {...register("company.legal_representative.dni_document.DNI")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-legal-representative-name")}
          {...register("company.legal_representative.name")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-legal-representative-phone")}
          {...register("company.legal_representative.phone")}
          type="tel"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-legal-representative-DNI-image")}
          {...register("company.legal_representative.dni_document.DNI_image")}
          type="file"
          accept="image/png, image/jpeg, application/pdf"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-DNI")}
          {...register("company.dni_document.DNI")}
          type="text"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />
        <Input
          label={t("form:input-label-DNI-image")}
          {...register("company.dni_document.DNI_image")}
          type="file"
          accept="image/png, image/jpeg, application/pdf"
          variant="outline"
          className="mb-4 w-[100%] max-w-[600px]"
          // error={t(errors?.email?.message!)}
        />

        <Button
          className="max-w-[400px] w-full"
          loading={loading}
          disabled={loading}
        >
          {t("form:text-register")}
        </Button>

        {errorMessage ? (
          <Alert
            message={t(errorMessage)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMessage(null)}
          />
        ) : null}
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute start-2/4 -top-2.5 px-2 -ms-4 bg-light">
          {t("common:text-or")}
        </span>
      </div>
      <div className="text-sm sm:text-base text-body text-center">
        {t("form:text-already-account")}{" "}
        <Link
          href={ROUTES.LOGIN}
          className="ms-1 underline text-accent font-semibold transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-hover hover:no-underline focus:no-underline"
        >
          {t("form:button-label-login")}
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
