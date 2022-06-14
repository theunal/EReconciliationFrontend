

export interface AccountReconciliationModel {
    id: number
    companyId: number
    currencyId: number
    currentAccountId: number
    startingDate: string
    endingDate: string
    currencyDebit: number
    currencyCredit: number
    isSendEmail: boolean
    sendEmailDate: string
    isEmailRead: boolean
    emailReadDate: string
    isResultSucceed: boolean
    resultDate: string
    resultNote: string
    guid: string
}