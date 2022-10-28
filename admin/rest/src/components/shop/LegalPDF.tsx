import { useShopQuery } from '@data/shop/use-shop.query';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Resume from './resume';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function PDFTest() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: shopData, isLoading: isShopLoading } = useShopQuery(
    router.query.shop as string
  );
  const [userData, setUserData] = useState<IUserCompanyData | null>(null);
  useEffect(() => {
    if (!shopData) return;

    (async () => {
      try {
        const tkn = Cookies.get('AUTH_CRED')!;
        if (!tkn) return;
        const { token } = JSON.parse(tkn);
        const res: any = await axios.get(
          'owner-info/' + shopData?.shop.owner_id,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        setUserData(res.data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [shopData]);
  if (!userData) return <span> {t('common:text-loading')}</span>;
  if (!userData?.company) return <span></span>;
  return (
    <PDFDownloadLink
      document={<Resume userData={userData!} />}
      fileName="invoice.pdf"
      className="break-normal"
    >
      {({ loading }: any) =>
        loading ? (
          t('common:text-loading')
        ) : (
          <span className="flex w-full items-center text-base text-body-dark text-start focus:text-accent gap-4 cursor-pointer hover:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>

            <span>Legal</span>
          </span>
        )
      }
    </PDFDownloadLink>
  );
}

export interface IUserCompanyData {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  salary: null;
  contract: null;
  created_at: string;
  updated_at: string;
  is_active: number;
  shop_id: null;
  shops: [
    {
      id: number;
      owner_id: number;
      premium: false;
      approval_token_id: null;
      country_id: null;
      premium_plan_id: null;
      name: string;
      slug: string;
      description: null;
      cover_image: [];
      logo: {
        id: number;
        original: string;
        thumbnail: string;
      };
      rating: null;
      is_active: number;
      address: {
        zip: string;
        city: string;
        state: string;
        country: string;
        street_address: string;
      };
      settings: { contact: null; socials: []; website: null; location: [] };
      created_at: string;
      updated_at: string;
    }
  ];
  company: {
    id: number;
    user_id: number;
    legal_representative_id: number;
    dni_document_id: number;
    name: string;
    line_of_business: string;
    physical_address: null;
    fiscal_address: null;
    tax_country: string;
    business_phone: string;
    products_description: string;
    dni_document: {
      id: number;
      DNI: string;
      DNI_document_path: string;
    };
    legal_representative: {
      id: number;
      dni_document_id: number;
      name: string;
      phone: string;
      dni_document: {
        id: number;
        DNI: string;
        DNI_document_path: string;
      };
    };
  };
}
