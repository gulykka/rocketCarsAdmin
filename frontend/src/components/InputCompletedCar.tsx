import React, {useEffect, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import {clearSearchCompletedCars, searchCompletedCars} from "../store/slices/carSlice";
import {useAppDispatch} from "../hooks/redux-hooks";

const InputCompletedCar = () => {
    const dispatch = useAppDispatch()

    const [textSearch, setTextSearch] = useState('')

    useEffect(() => {
        return () => {
            dispatch(clearSearchCompletedCars())
            console.log(0)
        };

    }, [textSearch]);

    function searchCar() {
        dispatch(searchCompletedCars(textSearch))
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

export default InputCompletedCar;