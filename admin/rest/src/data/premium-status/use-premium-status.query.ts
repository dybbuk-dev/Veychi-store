import PremiumPlans from "@repositories/premium-plans";
import { useQuery } from "react-query";
import { Premium } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchPremiumStatus = async (slug: string) => {
  const { data } = await PremiumPlans.find(`premium-plans/${slug}`);
  return data;
};

export const usePremiumStatusQuery = (identifier: string) => {
  return useQuery<Premium, Error>(
    [API_ENDPOINTS.PREMIUM_STATUS, identifier],
    () => fetchPremiumStatus(identifier)
  );
};
