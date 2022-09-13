import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useRegisterCompanyMutation} from "@data/company/use-register-company.mutation";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Input from "@components/ui/input";

type dni_document = {
    DNI:string,
    DNI_document_path:string
}

type LegalRepresentative = {
    name:string
    phone:string
}

type FormValues = {
    name:string,
    line_of_business:string,
    physical_address:string,
    fiscal_address:string,
    tax_country:string,
    business_phone:string,
    products_description:string,
    user_id:number,
    legal_representative:LegalRepresentative,
    dni_document:dni_document
};
const companyFormSchema = yup.object().shape({
    name: yup.string().required(),
    line_of_business:yup.string().required().max(191),
    physical_address:yup.string().required().max(191),
    fiscal_address:yup.string().required().max(191),
    tax_country:yup.string().required().max(191),
    business_phone:yup.string().required().max(191),
    products_description:yup.string().required().max(191),
    legal_representative:yup.object().required(),
    dni_document:yup.object().required()
});
const defaultValues  = {
    name:"",
    line_of_business:"",
    physical_address:"",
    fiscal_address:"",
    tax_country:"",
    business_phone:"",
    products_description:"",
};

const CompanyCreateForm = () => {
    const { t } = useTranslation();
    const {mutate:registerCompany,isLoading : loading } = useRegisterCompanyMutation()
    const { register, handleSubmit,setError,formState:{errors}} = useForm<FormValues>({defaultValues,resolver:yupResolver(companyFormSchema)})
    async function onSubmit({name, line_of_business, physical_address, fiscal_address, tax_country, business_phone, products_description, legal_representative, dni_document}: FormValues){
        registerCompany(
            {
                variables:{
                    name,
                    line_of_business,
                    physical_address,
                    fiscal_address,
                    tax_country,
                    business_phone,
                    products_description,
                    legal_representative,
                    dni_document
                }
            },
            {
                onError: (error: any) => {
                    Object.keys(error?.response?.data).forEach((field: any) => {
                        setError(field, {
                            type: "manual",
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
                <Card
                    title={t("form:form-title-information")}
                    details={t("form:customer-form-info-help-text")}
                    className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
                >
                </Card>
                <Card className="w-full sm:w-8/12 md:w-2/3">
                    <Input
                        label={t('form:input-label-name')}
                        {...register("name")}
                        type="text"
                        variant="outline"
                        className="mb-4"
                        error={t(errors.name?.message!)}
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
                    <Input
                        label={t("form:input-label-products-description")}
                        {...register("products_description")}
                        type="text"
                        variant="outline"
                        className="mb-4"
                        error={t(errors.products_description?.message!)}
                    />

                </Card>
            </div>
        </form>
    )
}
export default CompanyCreateForm;