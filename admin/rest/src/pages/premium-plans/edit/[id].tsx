import Layout from "@components/layouts/admin";
import { useRouter } from "next/router";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { usePremiumStatusQuery } from "@data/premium-status/use-premium-status.query";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import CreateOrUpdatePremiumForm from "./../../../components/premium-plans/tax-form";

export default function UpdateTaxPage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const {
    data,
    isLoading: loading,
    error,
  } = usePremiumStatusQuery(query.id as string);
  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          Plan Premium #{data?.id}
        </h1>
      </div>
      <CreateOrUpdatePremiumForm initialValues={data} />
    </>
  );
}
UpdateTaxPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
