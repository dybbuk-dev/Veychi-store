import AdministratorEditForm from "@components/administrators/administrator-edit-form";
import Layout from "@components/layouts/admin";
import axios from "axios";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function EditStaffPage() {
  const { t } = useTranslation();
  const { id } = useRouter().query;
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUser = async () => {
    const tkn = Cookies.get("AUTH_CRED")!;

    if (!tkn) return setIsLoading(false);
    const { token } = JSON.parse(tkn);
    try {
      const res = await axios.get("/users/" + id, {
        headers: {
          authorization: "Bearer " + token,
        },
      });
      setUserData(res.data);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:form-title-edit-administrator")}
        </h1>
      </div>
      {userData && !isLoading && (
        <AdministratorEditForm defaultValues={userData} />
      )}
    </>
  );
}
EditStaffPage.Layout = Layout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["form", "common"])),
  },
});
