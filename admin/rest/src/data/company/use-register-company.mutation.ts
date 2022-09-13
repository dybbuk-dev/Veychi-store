import { CompanyInput } from "@ts-types/generated";
import { useMutation } from "react-query";
import Company from "@repositories/company";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IRegisterVariables {
    variables: CompanyInput;
}

export const useRegisterCompanyMutation = () => {
    return useMutation(({ variables }: IRegisterVariables) =>
        Company.create(API_ENDPOINTS.COMPANY, variables)
    );
};

