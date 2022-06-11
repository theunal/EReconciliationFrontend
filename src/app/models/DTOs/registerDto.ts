import { CompanyModel } from "../companyModel";
import { RegisterModel } from "../registerModel";


// sıfırdan kullanıcı ve şirket ekleme

export interface RegisterDto {
    userRegisterDto: RegisterModel
    company: CompanyModel
}