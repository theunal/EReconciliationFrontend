

// company id ye göre kullanıcı listesi 

export interface UsersByCompanyDto {
    id: number;
    userId: number
    companyId: number
    name: string
    email: string
    mailConfirm: boolean
    userMailValue: string
    companyName: string
    userAddedAt: string
    userIsActive: boolean
}