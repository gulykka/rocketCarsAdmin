import React, {useEffect, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import OperationCarsList from "./OperationCarsList";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import InputOperationCar from "./InputOperationCar";

const CarOperation = () => {
    const isSearch = useAppSelector(state => state.data.searchOCarBool)

    return (
        <>
            <div className={'work_panel_container'}>
                <div className={'input_desktop'}><InputOperationCar/></div>
            </div>
            <OperationCarsList/>
        </>
    );
};

export default CarOperation;