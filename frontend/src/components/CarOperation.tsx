import React, {useState} from 'react';
import ColorButton from "./UI/ColorButton";
import OperationCarsList from "./OperationCarsList";

const CarOperation = () => {
    const [textSearch, setTextSearch] = useState('')
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
                    <ColorButton>Найти</ColorButton>
                </div>
            </div>
            <OperationCarsList />
        </>
    );
};

export default CarOperation;