import React, {FC, useState} from 'react';
import {ICar} from "../interfaces";
import ColorButton from "./UI/ColorButton";
import {getOffset, getStatusCode} from "../status";
import ShadowWindow from "./ShadowWindow";
import {formatDateToDDMMYYYY} from "../functions/changeDate";
import JSZip from 'jszip';
import {saveAs} from "file-saver";

interface CompletedCarCardProps {
    completedCar: ICar
}

const CompletedCarCard:FC<CompletedCarCardProps> = ({completedCar}) => {
    const [chosenPhoto, setChosenPhoto] = useState(0);
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPhotosAsZip = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const imgFolder = zip.folder(`${completedCar.name}_photos`);

            // Добавляем каждое фото в архив
            for (let i = 0; i < completedCar.photos.length; i++) {
                const photoUrl = completedCar.photos[i];
                const response = await fetch(photoUrl);
                const blob = await response.blob();

                // Получаем расширение файла из URL или используем jpg по умолчанию
                const extension = photoUrl.split('.').pop()?.toLowerCase() || 'jpg';
                const filename = `photo_${i + 1}.${extension}`;

                imgFolder?.file(filename, blob);
            }

            // Генерируем и скачиваем архив
            const content = await zip.generateAsync({type: 'blob'});
            saveAs(content, `${completedCar.name}_photos.zip`);
        } catch (error) {
            console.error('Ошибка при создании архива:', error);
            alert('Произошла ошибка при скачивании фотографий');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={'completed_car_card_container'}>
            <div className={'information_container'}>
                <span style={{fontSize: '25px'}}>{completedCar.name}</span>
                <span>{completedCar.auto}</span>
                <span>{completedCar.year}</span>
                <span>{completedCar.VIN}</span>
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
                <ColorButton
                    onClick={downloadPhotosAsZip}
                    disabled={isDownloading}
                >
                    {isDownloading ? 'Скачивание...' : 'Скачать'}
                </ColorButton>
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