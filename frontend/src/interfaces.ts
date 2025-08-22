export interface IStatus {
    level: number,
    description: string
    datetime: string
}

export interface ICar{
    id: number | string,
    parent_id: number | string | null,
    name: string,
    VIN: string,
    auto: string,
    year: string,
    photos: string[],
    status: IStatus,
}

export interface ICarPhoto {
    url: string
}

export interface IManager {
    name: string
    number: string
}

export interface IUser {
    id: number
    name: string
}

export interface IData {
    user: IUser
    manager: IManager
    cars : ICar[]

}