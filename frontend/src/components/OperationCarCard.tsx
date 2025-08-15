import React, {FC, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import {getOffset, getStatusCode} from "../status";
import {ICar} from "../interfaces";
import ShadowWindow from "./ShadowWindow";
import {formatDateToDDMMYYYY} from "../functions/changeDate";

interface OperationCarCardProps {
    operationCar: ICar
}

const OperationCarCard: FC<OperationCarCardProps> = ({operationCar}) => {
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const code = operationCar.status.level



    return (
        <div className={'operation_car_card_container'}>
            <div className={'information_container_'}>
                <div className={'information_person_container'}>
                    <span>{operationCar.name}</span>
                    <span>{operationCar.VIN}</span>
                </div>
                <div className={'information_car_container'}>
                    <span>{operationCar.auto}</span>
                    <span>{operationCar.year}</span>
                </div>
                <div className={'information_car_status_container'}>
                    <div
                        style={{width: `${(code ?? 0) * 16}%`}}
                        className="line_progress">
                    </div>
                    <div className="line"></div>
                    <div
                        style={{left: `calc(${(code ?? 0) * 16}% - 10px)`}}
                        className="circle_progress">
                    </div>
                    <div
                        style={{left: `99%`}}
                        className="circle">
                    </div>
                    <span
                        className={'status_container'}
                        style={{marginLeft: getOffset(getStatusCode(operationCar.status.description))}}>
                        <span className={'status'}>{operationCar.status.description}</span>
                    </span>
                </div>
                <span>Дата изменения последнего статуса: {formatDateToDDMMYYYY(operationCar.status.datetime)}</span>
            </div>
            <div className={'photos_container'}>
                <img
                    onClick={() => {
                        setVisibleImageWindow(true);
                    }}
                    className={'photo_car'}
                    alt={'car_photo'}
                    src={operationCar.photos[0]}/>
                <ColorButton>Скачать</ColorButton>
            </div>
            {visibleImageWindow && (
                <ShadowWindow
                    imageSrc={operationCar.photos}
                    onClose={() => setVisibleImageWindow(false)}
                />
            )}
        </div>
    );
};

export default OperationCarCard;