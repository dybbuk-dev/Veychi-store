import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import OrderList from "@components/order/order-list";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useOrdersQuery } from "@data/order/use-orders.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SortOrder } from "@ts-types/generated";
import { adminOnly } from "@utils/auth-utils";
import { getToken } from "../../../../../shop/src/framework/rest/utils/get-token";
import Cookies from "js-cookie";
import { saveXLSXData } from "../withdraws";
import moment from "moment";
import axios from "axios";
import { fetchMe } from "@data/user/use-me.query";
import xlsx from "json-as-xlsx";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const {
    data,
    isLoading: loading,
    error,
  } = useOrdersQuery({
    limit: 20,
    page,
    text: searchTerm,
  });
  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  const handleExport = async () => {
    try {
      const tkn = Cookies.get("AUTH_CRED")!;
      if (!tkn) return;
      let queryStr =
        process.env.NEXT_PUBLIC_REST_API_ENDPOINT + "orders/export/all";
      const { token } = JSON.parse(tkn);
      const res = await axios.get(queryStr, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const dateNow = moment(new Date()).format("YYYY-DD-MM");
      saveXLSXData!(res.data, `ordenes_${dateNow}.csv`);
    } catch (error) {}
  };
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0 ">
          <h1 className="text-lg font-semibold text-heading">
            {t("form:input-label-orders")}
          </h1>
        </div>

        <div className="w-full md:w-1/2 flex flex-col md:flex-row ms-auto gap-2 items-center">
          <Search onSearch={handleSearch} />
          <button
            type="button"
            onClick={handleExport}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Exportar
          </button>
        </div>
      </Card>

      <OrderList
        orders={data?.orders}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Orders.authenticate = {
  permissions: adminOnly,
};

Orders.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
