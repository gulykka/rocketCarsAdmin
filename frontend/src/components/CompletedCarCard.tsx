import React, {FC, useState} from 'react';
import {ICar} from "../interfaces";
import ColorButton from "./UI/ColorButton";
import {getOffset, getStatusCode} from "../status";
import ShadowWindow from "./ShadowWindow";
import {formatDateToDDMMYYYY} from "../functions/changeDate";

interface CompletedCarCardProps {
    completedCar: ICar
}

const CompletedCarCard:FC<CompletedCarCardProps> = ({completedCar}) => {
    const [chosenPhoto, setChosenPhoto] = useState(0);
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);

    return (
        <div className={'completed_car_card_container'}>
            <div className={'information_container'}>
                <span style={{fontSize: '25px'}}>{completedCar.name}</span>
                <span>{completedCar.VIN}</span>
                <span>{completedCar.auto}</span>
                <span>{completedCar.year}</span>
                <div className={'information_car_completed_status_container'}>
                    <span
                        className={'status_completed_container'}>
                        <span className={'status_completed'}>{formatDateToDDMMYYYY(completedCar.status.datetime)}</span>
                    </span>
                    <span style={{textAlign: 'center'}}>{completedCar.status.description}</span>
                </div>
            </div>
            <div className={'photos_container'}>
                <img
                    onClick={() => {
                        setVisibleImageWindow(true);
                    }}
                    className={'photo_car'}
                    alt={'car_photo'}
                    src={completedCar.photos[0]}/>
                <ColorButton>Скачать</ColorButton>
            </div>
            {visibleImageWindow && (
                <ShadowWindow
                    selectedIndex={chosenPhoto}
                    imageSrc={completedCar.photos}
                    onClose={() => setVisibleImageWindow(false)}
                />
            )}
        </div>
    );
};

export default CompletedCarCard;