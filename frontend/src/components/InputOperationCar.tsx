import React, {useEffect, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import {useAppDispatch} from "../hooks/redux-hooks";
import {clearSearchOptionalCars, searchOptionalCars} from "../store/slices/carSlice";

const InputOperationCar = () => {
    const dispatch = useAppDispatch()

    const [textSearch, setTextSearch] = useState('')

    useEffect(() => {
        return () => {
            dispatch(clearSearchOptionalCars())
        };
    }, [textSearch]);

    function searchCar() {
        dispatch(searchOptionalCars(textSearch))
    }

    return (
        <div className={'search_container'}>
            <input
                className={'input_search'}
                placeholder={'Поиск...'}
                value={textSearch}
                onChange={(event) => setTextSearch(event.target.value)}/>
            <ColorButton
                onClick={searchCar}
            >
                Найти
            </ColorButton>
        </div>
    );
};

export default InputOperationCar;