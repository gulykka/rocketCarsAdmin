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
    const [newPhotos, setNewPhotos] = useState([])
    const [loading, setLoading] = useState(false)

    const downloadPhotosAsZip = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const imgFolder = zip.folder(`${completedCar.name}_photos`);

            if (!imgFolder) {
                throw new Error('Не удалось создать папку в архиве');
            }

            // Шаг 1: Собираем все URL фото (сначала из completedCar.photos)
            let allPhotoUrls = [...completedCar.photos];

            // Шаг 2: Загружаем дополнительные фото с сервера
            try {
                const response = await fetch(`http://localhost:5000/api/load-photos/${completedCar.parent_id}/${completedCar.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // console.log()
                if (response.ok) {
                    const photosData = await response.json();
                    console.log(photosData.photos)
                    if (photosData?.photos && Array.isArray(photosData.photos)) {
                        allPhotoUrls = [...allPhotoUrls, ...photosData.photos];
                    }
                } else {
                    console.warn('Не удалось загрузить дополнительные фото, продолжаем с имеющимися');
                }
            } catch (error) {
                console.warn('Ошибка при загрузке дополнительных фото, используем только локальные', error);
                // Продолжаем с теми, что уже есть
            }

            if (allPhotoUrls.length === 0) {
                alert('Нет фотографий для скачивания');
                return;
            }

            // Шаг 3: Загружаем все фото (старые + новые) в архив
            const downloadPromises = allPhotoUrls.map(async (photoUrl, index) => {
                try {
                    const urlWithTimestamp = `${photoUrl}?t=${Date.now()}`;
                    const response = await fetch(urlWithTimestamp, {
                        mode: 'cors',
                        credentials: 'omit',
                        headers: {
                            'Accept': 'image/*',
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const blob = await response.blob();

                    if (!blob.type.startsWith('image/')) {
                        throw new Error('Получен не изображение');
                    }

                    let extension = 'jpg';
                    if (blob.type === 'image/jpeg') extension = 'jpg';
                    else if (blob.type === 'image/png') extension = 'png';
                    else if (blob.type === 'image/gif') extension = 'gif';
                    else if (blob.type === 'image/webp') extension = 'webp';
                    else {
                        const urlExtension = photoUrl.split('.').pop()?.toLowerCase();
                        if (urlExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(urlExtension)) {
                            extension = urlExtension;
                        }
                    }

                    const filename = `${completedCar.name}_photo_${index + 1}.${extension}`;
                    imgFolder.file(filename, blob);

                    return { success: true, index };
                } catch (error) {
                    console.error(`Ошибка загрузки фото ${index + 1}:`, error);
                    return { success: false, index, error };
                }
            });

            const results = await Promise.all(downloadPromises);
            const failedDownloads = results.filter(result => !result.success);

            if (failedDownloads.length === allPhotoUrls.length) {
                throw new Error('Не удалось загрузить ни одного фото');
            }

            if (failedDownloads.length > 0) {
                console.warn(`Не удалось загрузить ${failedDownloads.length} фото`);
            }

            // Генерация архива
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 6
                }
            });

            const safeCarName = completedCar.name.replace(/[^a-zA-Z0-9а-яА-Я\s]/g, '').trim();
            const zipFilename = `${safeCarName}_${completedCar.auto}_photos_${formatDateToDDMMYYYY(new Date().toString()).replace(/\./g, '-')}.zip`;

            saveAs(content, zipFilename);

        } catch (error) {
            console.error('Ошибка при создании архива:', error);
            alert('Произошла ошибка при скачивании фотографий.');
        } finally {
            setIsDownloading(false);
        }
    };

    async function getPhotos() {
        try {
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetch(`http://localhost:5000/api/load-photos/${completedCar.parent_id}/${completedCar.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const photosData = await response.json()
            console.log(photosData)
            setNewPhotos(photosData.photos)
            setVisibleImageWindow(true)
            setLoading(false)
            if (!response.ok || photosData.status_code !== 200) {
                return new Error('Не удалось получить фотографии');
            } else {
                console.log(0)

            }
        } catch (e: any) {

        }
    }

    return (
        <div className={'completed_car_card_container'}>
            <div className={'information_container'}>
                <span style={{fontSize: '25px'}}>{completedCar.name}</span>
                <span>{completedCar.auto}</span>
                <span>{completedCar.year}</span>
                <span>{completedCar.VIN}</span>
                <div className={'information_car_completed_status_container'}>
                    <span className={'status_completed_container'}>
                        <span className={'status_completed'}>
                            {formatDateToDDMMYYYY(completedCar.status.datetime)}
                        </span>
                    </span>
                    <span style={{textAlign: 'center'}}>{completedCar.status.description}</span>
                </div>
            </div>
            <div className={'photos_container'}>
                {loading && <span className={'title_loading'}>загрузка...</span>}
                <img
                    onClick={getPhotos}
                    className={loading ? 'photo_car loading' : 'photo_car'}
                    alt={'car_photo'}
                    src={completedCar.photos[0]}
                    onError={(e) => {
                        // Запасное изображение если фото не загружается
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                />
                <ColorButton
                    onClick={downloadPhotosAsZip}
                    disabled={isDownloading || completedCar.photos.length === 0}
                    title={completedCar.photos.length === 0 ? 'Нет фото для скачивания' : ''}
                >
                    {isDownloading ? 'Скачивание...' : `Скачать`}
                </ColorButton>
            </div>
            {visibleImageWindow && (
                <ShadowWindow
                    selectedIndex={chosenPhoto}
                    imageSrc={[...completedCar.photos, ...newPhotos]}
                    onClose={() => setVisibleImageWindow(false)}
                />
            )}
        </div>
    );
};

export default CompletedCarCard;