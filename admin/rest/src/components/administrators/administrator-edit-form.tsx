import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useTranslation } from "next-i18next";
import SelectInput from "@components/ui/select-input";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import FileInput from "@components/ui/file-input";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

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

const AdministratorEditForm = ({ defaultValues }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,

    /*     formState: { errors },
     */
  } = useForm<FormValues>({
    defaultValues,
  });
  async function onSubmit(data: any) {
    const tkn = Cookies.get("AUTH_CRED")!;

    if (!data?.name)
      return Swal.fire("Ups!", "Debes agregar un nombre", "error");
    if (!data?.email)
      return Swal.fire("Ups!", "Debes agregar un email", "error");
    if (!data?.salary)
      return Swal.fire("Ups!", "Debes agregar un salario", "error");
    if (!data?.contract && !defaultValues?.contract)
      return Swal.fire("Ups!", "Debes agregar un contrato", "error");
    if (!tkn) return;
    const { token } = JSON.parse(tkn);
    try {
      let body: any = {
        name: data.name,
        salary: parseInt(data.salary || "0"),
        contract: data?.contract?.thumbnail
          ? data?.contract?.thumbnail
          : defaultValues?.contract,
      };
      if (data.email !== defaultValues.email) body.email = data.email;
      const res = await axios.put("/users/" + defaultValues.id, body, {
        headers: {
          authorization: "Bearer " + token,
        },
      });
      Swal.fire({
        title: "Perfecto!",
        text: "Información actualizada correctamente!",
        icon: "success",
        confirmButtonColor: "#5697FA",
        confirmButtonText: "Ok!",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/administrators");
        }
      });

      console.log(res.data);
    } catch (e) {
      Swal.fire("Ups", "Tuvimos un problema!", "error");
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t("form:form-title-information")}
          details={t("form:customer-form-info-help-text")}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("form:input-label-name")}
            {...register("name")}
            required
            type="text"
            variant="outline"
            className="mb-4"
          />
          <Input
            label={t("form:input-label-email")}
            {...register("email")}
            required
            type="email"
            variant="outline"
            className="mb-4"
          />

          <Input
            label={t("form:input-label-salary")}
            {...register("salary")}
            required
            min={0}
            type="number"
            variant="outline"
            className="mb-4"
          />

          <SelectInput
            {...register("permission")}
            defaultValue={{ value: "staff", label: "Staff" }}
            control={control}
            options={[
              { value: "staff", label: "Staff" },
              { value: "shareholder", label: "Accionista" },
              { value: "CEO", label: "CEO" },
              { value: "manager_rh", label: "Manager RH" },
              { value: "marketing", label: "Marketing" },
              { value: "management", label: "Administración" },
              { value: "legal", label: "Legal" },
              { value: "customer", label: "Empleado" },
              { value: "super_admin", label: "Super Admin" },
            ]}
          />
          <h2 className="block text-body-dark font-semibold text-sm leading-none mb-3 mt-4">
            Contrato{" "}
            {defaultValues?.contract ? (
              <a
                href={defaultValues.contract}
                target="_blank"
                style={{ color: "#5697FA" }}
              >
                (Ver contrato actual)
              </a>
            ) : (
              <span className="text-red-500">(Sin contrato)</span>
            )}
            :
          </h2>
          <FileInput
            name={"contract"}
            control={control}
            multiple={false}
            accept={"application/pdf"}
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {t("form:button-label-edit-administrator")}
        </Button>
      </div>
    </form>
  );
};

export default AdministratorEditForm;
