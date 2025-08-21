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
    const code = operationCar.status.level;
    const currentStatus = code ?? 0;

    return (
        <div className={'operation_car_card_container'}>
            <div className={'information_container_'}>
                <span style={{fontSize: '25px'}}>{operationCar.name}</span>
                <span>{operationCar.VIN}</span>
                <span>{operationCar.auto}</span>
                <span>{operationCar.year}</span>
                <div className={'information_car_status_container'}>
                    <div
                        style={{width: `${currentStatus * 16.7}%`}}
                        className="line_progress">
                    </div>
                    <div className="line"></div>

                    {[1, 2, 3, 4, 5, 6].map((statusNumber) => (
                        <div
                            key={statusNumber}
                            style={{left: `${(statusNumber) * 16.7}%`}}
                            className={`circle ${statusNumber <= currentStatus ? 'circle_progress' : ''}`}>
                        </div>
                    ))}

                    <span
                        style={{marginLeft: getOffset(getStatusCode(operationCar.status.description))}}
                        className={'status_container'}>
                        <span className={'status'}>{operationCar.status.description}</span>
                    </span>
                </div>
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