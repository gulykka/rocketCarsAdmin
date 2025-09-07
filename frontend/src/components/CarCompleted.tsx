import React, {useEffect} from 'react';
import { sortCarsByDate } from '../store/slices/carSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import InputCompletedCar from './InputCompletedCar';
import CompletedCarsList from './CompletedCarsList';

const CarCompleted = () => {
    const dispatch = useAppDispatch();
    const sortOrder = useAppSelector(state => state.data.sortOrder);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as 'newest' | 'oldest';
        if (value === 'newest' || value === 'oldest') {
            dispatch(sortCarsByDate(value));
        }
    };

    useEffect(() => {
        dispatch(sortCarsByDate('newest'));
    }, [])



    return (
        <>
            <div className="sort_container">
                Сортировка по дате:
                <select
                    value={sortOrder}
                    onChange={handleSortChange}
                >
                    <option value="newest">сначала новые</option>
                    <option value="oldest">сначала старые</option>
                </select>
            </div>
            <div className="work_panel_container">
                <div className="input_desktop">
                    <InputCompletedCar />
                </div>
            </div>
            <CompletedCarsList />
        </>
    );
};

export default CarCompleted;