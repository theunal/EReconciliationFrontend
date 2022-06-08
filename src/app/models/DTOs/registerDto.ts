import { CompanyModel } from "../companyModel";
import { RegisterModel } from "../registerModel";


    export interface RegisterDto {
        userRegisterDto : RegisterModel
        company : CompanyModel
    }