import React, {useEffect} from 'react';
import {
    sortCarsByDate,
    applyDefaultSort // Добавляем импорт
} from "../store/slices/carSlice";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import InputCompletedCar from "./InputCompletedCar";
import CompletedCarsList from "./CompletedCarsList";

const CarCompleted = () => {
    const dispatch = useAppDispatch();
    const sortOrder = useAppSelector(state => state.data.sortOrder);

    // Применяем сортировку по умолчанию при монтировании компонента
    useEffect(() => {
        dispatch(applyDefaultSort());
    }, [dispatch]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'newest' || value === 'oldest') {
            dispatch(sortCarsByDate(value));
        }
    };

    return (
        <>
            <div className={'work_panel_container'}>
                <div className={'sort_container'}>
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="newest">От новых к старым</option>
                        <option value="oldest">От старых к новым</option>
                    </select>
                </div>
                <div className={'input_desktop'}><InputCompletedCar /></div>
            </div>
            <CompletedCarsList />
        </>
    );
};

export default CarCompleted;