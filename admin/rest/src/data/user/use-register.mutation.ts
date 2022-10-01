import { FormValues } from "@ts-types/generated";
import { useMutation } from "react-query";
import User from "@repositories/user";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IRegisterVariables {
  variables: FormValues.RootObject;
}

export const useRegisterMutation = () => {
  return useMutation(({ variables }: IRegisterVariables) =>
    User.register(API_ENDPOINTS.REGISTER, variables)
  );
};
