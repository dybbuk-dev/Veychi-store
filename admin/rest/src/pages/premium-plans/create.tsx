import Layout from "@components/layouts/admin";
import CreateOrUpdatePremiumForm from "@components/premium-plans/tax-form";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CreateTaxPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          Crear nuevo Plan Premium
        </h1>
      </div>
      <CreateOrUpdatePremiumForm />
    </>
  );
}
CreateTaxPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "form", "common"])),
  },
});
