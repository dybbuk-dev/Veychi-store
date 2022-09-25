import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "@components/ui/link";
import { allowedRoles, hasAccess, setAuthCredentials } from "@utils/auth-utils";
import { Permission } from "@ts-types/generated";
import { useRegisterMutation } from "@data/user/use-register.mutation";
type dni_document = {
	DNI:string,
	DNI_document_path:string
}

type LegalRepresentative = {
	name:string
	phone:string
}

type FormValues = {
	name: string;
	email: string;
	password: string;
	permission: Permission;
	physical_address:string,
	fiscal_address:string,
	tax_country:string,
	business_phone:string,
	products_description:string,
	line_of_business:string,
	user_id:number,
	legal_representative:LegalRepresentative,
	dni_document:dni_document
};
const registrationFormSchema = yup.object().shape({
	name: yup.string().required("form:error-name-required"),
	email: yup
		.string()
		.email("form:error-email-format")
		.required("form:error-email-required"),
	password: yup.string().required("form:error-password-required"),
	permission: yup.string().default("store_owner").oneOf(["store_owner"]),
	line_of_business:yup.string().required().max(191),
	physical_address:yup.string().required().max(191),
	fiscal_address:yup.string().required().max(191),
	tax_country:yup.string().required().max(191),
	business_phone:yup.string().required().max(191),
	products_description:yup.string().required().max(191),
	legal_representative:yup.object().required(),
	dni_document:yup.object().required()
});
const RegistrationForm = () => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormValues>({
		resolver: yupResolver(registrationFormSchema),
		defaultValues: {
			permission: Permission.StoreOwner,
		},
	});
	const router = useRouter();
	const { t } = useTranslation();

	async function onSubmit({ name, email, password, permission,line_of_business,
								physical_address,
								fiscal_address,
								tax_country,
								business_phone,
								products_description,
								legal_representative,
								dni_document }: FormValues) {
		registerUser(
			{
				variables: {
					name,
					email,
					line_of_business,
					physical_address,
					fiscal_address,
					tax_country,
					business_phone,
					products_description,
					legal_representative,
					dni_document,
					password,
					permission,
				},
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
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="flex justify-between pl-10 pr-10 gap-10">
					<div className="w-screen">
						<Input
							label={t("form:input-label-name")}
							{...register("name")}
							variant="outline"
							className="mb-4"
							error={t(errors?.name?.message!)}
						/>
						<Input
							label={t("form:input-label-email")}
							{...register("email")}
							type="email"
							variant="outline"
							className="mb-4"
							error={t(errors?.email?.message!)}
						/>
						<Input
							label={t("form:input-label-line-of-business")}
							{...register("line_of_business")}
							type="text"
							variant="outline"
							className="mb-4"
							error={t(errors.line_of_business?.message!)}
						/>
						<Input
							label={t("form:input-label-physical-address")}
							{...register("physical_address")}
							type="text"
							variant="outline"
							className="mb-4"
							error={t(errors.physical_address?.message!)}
						/>
					</div>
					<div className="w-screen">

						<Input
							label={t("form:input-label-fiscal-address")}
							{...register("fiscal_address")}
							type="text"
							variant="outline"
							className="mb-4"
							error={t(errors.fiscal_address?.message!)}
						/>
						<Input
							label={t("form:input-label-tax-country")}
							{...register("tax_country")}
							type="text"
							variant="outline"
							className="mb-4"
							error={t(errors.tax_country?.message!)}
						/>
						<Input
							label={t("form:input-label-business-phone")}
							{...register("business_phone")}
							type="text"
							variant="outline"
							className="mb-4"
							error={t(errors.business_phone?.message!)}
						/>
					</div>
					<div className="w-screen">
						<Input
							label={t("form:input-label-products-description")}
							{...register("products_description")}
							type="text"
							variant="outline"
							className="mb-4"
							error={t(errors.products_description?.message!)}
						/>
						<PasswordInput
							label={t("form:input-label-password")}
							{...register("password")}
							error={t(errors?.password?.message!)}
							variant="outline"
							className="mb-4"
						/>
					</div>
				</div>


				<Button className="w-full" loading={loading} disabled={loading}>
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
