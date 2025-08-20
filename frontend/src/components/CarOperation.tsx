import React, {useEffect, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import OperationCarsList from "./OperationCarsList";
import {useAppDispatch} from "../hooks/redux-hooks";
import {clearSearchOptionalCars, searchOptionalCars} from "../store/slices/carSlice";
import InputCompletedCar from "./InputCompletedCar";
import InputOperationCar from "./InputOperationCar";

const CarOperation = () => {

    return (
        <>
            <div className={'work_panel_container'}>
                <div className={'input_desktop'}><InputOperationCar /></div>
            </div>
            <OperationCarsList />
        </>
    );
};

export default CarOperation;