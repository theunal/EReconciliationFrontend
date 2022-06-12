import { CompanyModel } from "../companyModel"


export interface UserRelationshipDto {
    id: number
    adminUserId: number
    userUserId: number

    adminUserName: string
    adminEmail: string
    adminAddedAt: string
    adminIsActive: boolean

    userUserName: string
    userEmail: string
    userAddedAt: string
    userIsActive: boolean
    userMailValue: string
    userMailConfirm: boolean

    companies: CompanyModel[]
}
