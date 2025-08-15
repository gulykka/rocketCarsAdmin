import React, {useEffect, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import OperationCarsList from "./OperationCarsList";
import CompletedCarsList from "./CompletedCarsList";
import {
    clearSearchCompletedCars,
    clearSearchOptionalCars,
    searchCompletedCars,
    searchOptionalCars
} from "../store/slices/carSlice";
import {useAppDispatch} from "../hooks/redux-hooks";

const CarCompleted = () => {
    const dispatch = useAppDispatch()

    const [textSearch, setTextSearch] = useState('')

    useEffect(() => {
        return () => {
            dispatch(clearSearchCompletedCars())
        };
    }, [textSearch]);

    function searchCar() {
        dispatch(searchCompletedCars(textSearch))
    }

    return (
        <>
            <div className={'work_panel_container'}>
                <div className={'sort_container'}>
                    <select>
                        <option>Сортировать по</option>
                        <option>дате выдачи</option>
                    </select>
                </div>
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
            </div>
            <CompletedCarsList />
        </>
    );
};

export default CarCompleted;