import {CompanyInput, CompanyUpdate} from '@ts-types/generated';
import Base from "./base";

class Company extends Base<CompanyInput,CompanyUpdate>{

    get = async (url: string)=>{
        return await this.http(url,"get")
    };

    create = async (url:string,variables:CompanyInput)=>{
        return await this.http<CompanyInput>(url,"post",variables);
    };
    update = async (url:string,variables:CompanyUpdate)=>{
        return await this.http<CompanyUpdate>(url,"put",variables);
    }
}
export default new Company()