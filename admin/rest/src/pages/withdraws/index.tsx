import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import WithdrawList from "@components/withdraw/withdraw-list";
import { adminOnly } from "@utils/auth-utils";
import { useWithdrawsQuery } from "@data/withdraw/use-withdraws.query";
import { useState } from "react";
import { SortOrder } from "@ts-types/generated";
import axios from "axios";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import moment from "moment";
import Swal from "sweetalert2";
import xlsx from "json-as-xlsx";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function WithdrawsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {
    data,
    isLoading: loading,
    error,
  } = useWithdrawsQuery({
    limit: 10,
    page,
    sortedBy,
    orderBy,
  });
  const handleExport = async () => {
    try {
      const tkn = Cookies.get("AUTH_CRED")!;
      if (!tkn) return;
      const { token } = JSON.parse(tkn);

      const { data: withdraws } = await axios.get("/withdraws?limit=10000", {
        headers: {
          authorization: "Bearer " + token,
        },
      });

      let shops: any = {};
      for (const { shop, ...rest } of withdraws.data) {
        if (shops[shop.slug]) continue;

        const { data: shopInfo } = await axios.get(
          `/shops/${shop.slug}?limit=10000`,
          {
            headers: {
              authorization: "Bearer " + token,
            },
          }
        );
        shops[shop.slug] = shopInfo;
        console.log("calld");
      }
      const populatedWithdraws = withdraws.data.map(
        ({ shop, ...rest }: any) => ({ ...rest, shop: shops[shop.slug] })
      );
      saveXLSX({ data: populatedWithdraws });
      console.log({ populatedWithdraws });
    } catch (e) {
      console.error(e);
      Swal.fire("Ups!", "No se pudo exportar la información.", "error");
    }
  };

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center justify-between mb-8 w-full">
        <div className="flex items-center justify-content-between w-full">
          <h1 className="text-lg font-semibold text-heading">
            {t("common:sidebar-nav-item-withdraws")}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Descargar
        </button>
      </Card>

      <WithdrawList
        withdraws={data?.withdraws}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
WithdrawsPage.authenticate = {
  permissions: adminOnly,
};
WithdrawsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
export const saveXLSXData = (function () {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  document.body.appendChild(a);
  //@ts-ignore
  a.style = "display: none";
  return function (data: any, fileName: any) {
    const blob = new Blob([data], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();
let excelSettings = {
  extraLength: 3, // A bigger number means that columns will be wider
  writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
};

const saveXLSX = ({ data: initial }: any) => {
  const data = initial.map((data: any) => ({
    shopName: data?.shop?.name || " ",
    amount: data?.amount || " ",
    status: data?.status || " ",
    payment_method: data?.payment_method || " ",
    details: data?.details || " ",
    note: data?.note || " ",
    created_at: data?.created_at || " ",
    paymentName: data?.shop?.balance?.payment_info?.name || " ",
    accountType: data?.shop?.balance?.payment_info?.accountType || " ",
    email: data?.shop?.balance?.payment_info?.email || " ",
    bank: data?.shop?.balance?.payment_info?.bank || " ",
    account: data?.shop?.balance?.payment_info?.account || " ",
    iban: data?.shop?.balance?.payment_info?.iban || " ",
    swift: data?.shop?.balance?.payment_info?.swift || " ",
  }));
  const columns = [
    {
      label: "Nombre",
      value: "shopName",
    },
    {
      label: "Monto",
      value: "amount",
    },
    {
      label: "Estado",
      value: "status",
    },
    {
      label: "Método de Pago",
      value: "payment_method",
    },
    {
      label: "Detalles",
      value: "details",
    },
    {
      label: "Nota",
      value: "note",
    },
    {
      label: "Fecha del pedido",
      value: "created_at",
    },
    {
      label: "Nombre del titular de la cuenta",
      value: "paymentName",
    },
    {
      label: "Tipo de cuenta",
      value: "accountType",
    },
    {
      label: "Email",
      value: "email",
    },
    {
      label: "Nombre del Banco",
      value: "bank",
    },
    {
      label: "Número de Cuenta",
      value: "account",
    },
    {
      label: "IBAN",
      value: "iban",
    },
    {
      label: "SWIFT",
      value: "swift",
    },
  ].map(({ label, value }: any) => ({
    label,
    value,
  }));
  const content = data.map((row: any) => {
    const formattedRow: any = {};
    columns.forEach((column: any) => {
      formattedRow[column.value] = row[column.value];
    });
    return formattedRow;
  });

  let excel = [
    {
      sheet: "retiros-" + moment().format("DD-MM-YYYY"),
      columns,
      content,
    },
  ];
  xlsx(excel, {
    ...excelSettings,
    fileName: "retiros-" + moment().format("DD-MM-YYYY"),
  });
};
