export interface IOperationCar{
    name: string,
    VIN: string,
    auto: string,
    year: string,
    photos: ICarPhoto[],
    status: string
}

export interface ICompletedCar{
    name: string,
    VIN: string,
    auto: string,
    year: string,
    photos: ICarPhoto[],
    status: string
}

export interface ICarPhoto {
    url: string

}

export interface IManager {
    name: string
    number: string
}

export interface IData {
    id: string
    name: string
    manager: IManager
    completedCars: ICompletedCar[]
    OperationCars: IOperationCar[]

}