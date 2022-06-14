import { AccountReconciliationModel } from "../accountReconciliationModel";


export interface AccountReconciliationDto extends AccountReconciliationModel {
    companyName: string
    companyTaxDepartment: string
    companyTaxIdNumber: string
    companyIdentityNumber: string
    accountName: string
    accountCode: string
    accountTaxDepartment: string
    accountTaxIdNumber: string
    accountIdentityNumber: string
    accountEmail: string
    currencyCode: string
}