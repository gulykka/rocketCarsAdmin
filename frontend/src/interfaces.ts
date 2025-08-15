export interface IStatus {
    level: number,
    description: string
    dateTime: string | null
}

export interface ICar{
    name: string,
    VIN: string,
    auto: string,
    year: string,
    photos: ICarPhoto[],
    status: IStatus
}

export interface ICarPhoto {
    url: string
}

export interface IManager {
    name: string
    number: string
}

export interface IUser {
    name: string
}

export interface IData {
    user: IUser
    manager: IManager
    cars : ICar[]

}