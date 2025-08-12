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