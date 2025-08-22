import React, {useEffect, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import OperationCarsList from "./OperationCarsList";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {clearSearchOptionalCars, searchOptionalCars} from "../store/slices/carSlice";
import InputCompletedCar from "./InputCompletedCar";
import InputOperationCar from "./InputOperationCar";

const CarOperation = () => {
    const isSearch = useAppSelector(state => state.data.searchOCarBool)

    return (
        <>
            {isSearch &&
                <div className={'work_panel_container'}>
                <div className={'input_desktop'}><InputOperationCar /></div>
            </div>}
            <OperationCarsList />
        </>
    );
};

export default CarOperation;