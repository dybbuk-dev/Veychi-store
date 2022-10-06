import OrderStatus from '@repositories/order-status';
import { useQuery } from 'react-query';
import { OrderStatus as TOrderStatus } from '@ts-types/generated';
import { API_ENDPOINTS } from '@utils/api/endpoints';

export const fetchTicket = async (slug: string) => {
  const { data } = await OrderStatus.find(
    `${API_ENDPOINTS.ORDER_STATUS}/${slug}`
  );
  return data;
};

export const useTicketQuery = (identifier: string) => {
  return useQuery<TOrderStatus, Error>([API_ENDPOINTS.ORDER_STATUS], () =>
    fetchTicket(identifier)
  );
};
