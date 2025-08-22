import React, {FC, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import {getOffset, getStatusCode} from "../status";
import {ICar} from "../interfaces";
import ShadowWindow from "./ShadowWindow";
import {formatDateToDDMMYYYY} from "../functions/changeDate";
import JSZip from 'jszip';
import {saveAs} from "file-saver";

interface OperationCarCardProps {
    operationCar: ICar
}

const OperationCarCard: FC<OperationCarCardProps> = ({operationCar}) => {
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const code = operationCar.status.level;
    const currentStatus = code ?? 0;
    const [newPhotos, setNewPhotos] = useState([])
    const [loading, setLoading] = useState(false)

    const downloadPhotosAsZip = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const imgFolder = zip.folder(`${operationCar.name}_photos`);

            if (!imgFolder) {
                throw new Error('Не удалось создать папку в архиве');
            }

            // Создаем промисы для загрузки всех изображений
            const downloadPromises = operationCar.photos.map(async (photoUrl, index) => {
                try {
                    // Добавляем timestamp для избежания кеширования
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

                    // Проверяем, что это действительно изображение
                    if (!blob.type.startsWith('image/')) {
                        throw new Error('Получен не изображение');
                    }

                    // Определяем расширение из MIME type или URL
                    let extension = 'jpg';
                    if (blob.type === 'image/jpeg') extension = 'jpg';
                    else if (blob.type === 'image/png') extension = 'png';
                    else if (blob.type === 'image/gif') extension = 'gif';
                    else if (blob.type === 'image/webp') extension = 'webp';
                    else {
                        // Пытаемся получить расширение из URL
                        const urlExtension = photoUrl.split('.').pop()?.toLowerCase();
                        if (urlExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(urlExtension)) {
                            extension = urlExtension;
                        }
                    }

                    const filename = `${operationCar.name}_photo_${index + 1}.${extension}`;
                    imgFolder.file(filename, blob);

                    return { success: true, index };
                } catch (error) {
                    console.error(`Ошибка загрузки фото ${index + 1}:`, error);
                    return { success: false, index, error };
                }
            });

            // Ждем завершения всех загрузок
            const results = await Promise.all(downloadPromises);

            // Проверяем результаты
            const failedDownloads = results.filter(result => !result.success);

            if (failedDownloads.length === operationCar.photos.length) {
                throw new Error('Не удалось загрузить ни одного фото');
            }

            if (failedDownloads.length > 0) {
                console.warn(`Не удалось загрузить ${failedDownloads.length} фото`);
            }

            // Генерируем и скачиваем архив
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 6
                }
            });

            // Создаем понятное имя файла
            const safeCarName = operationCar.name.replace(/[^a-zA-Z0-9а-яА-Я\s]/g, '').trim();
            const newData = new Date()
            const zipFilename = `${safeCarName}_${operationCar.auto}_photos_${formatDateToDDMMYYYY(newData.toString()).replace(/\./g, '-')}.zip`;

            saveAs(content, zipFilename);


        } catch (error) {
            console.error('Ошибка при создании архива:', error);
            alert('Произошла ошибка при скачивании фотографий. Проверьте консоль для подробностей.');
        } finally {
            setIsDownloading(false);
        }
    };

    async function getPhotos() {
        try {
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetch(`http://localhost:5000/api/load-photos/${operationCar.parent_id}/${operationCar.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const photosData = await response.json()
            setNewPhotos(photosData.photos)
            setVisibleImageWindow(true)
            setLoading(false)
            if (!response.ok || photosData.status_code !== 200) {
                return new Error('Не удалось получить фотографии');
            } else {
            }
        } catch (e: any) {

        }
    }

    return (
        <div className={'operation_car_card_container'}>
            <div className={'information_container_'}>
                <span style={{fontSize: '25px'}}>{operationCar.name}</span>
                <span>{operationCar.auto}</span>
                <span>{operationCar.year}</span>
                <span>{operationCar.VIN}</span>
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
                {loading && <span className={'title_loading'}>загрузка...</span>}
                <img
                    onClick={getPhotos}
                    className={loading ? 'loading photo_car' : 'photo_car'}
                    alt={'car_photo'}
                    src={operationCar.photos[0]}
                    onError={(e) => {
                        // Запасное изображение если фото не загружается
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                />
                <ColorButton
                    onClick={downloadPhotosAsZip}
                    disabled={isDownloading || operationCar.photos.length === 0}
                    title={operationCar.photos.length === 0 ? 'Нет фото для скачивания' : ''}
                >
                    {isDownloading ? 'Скачивание...' : `Скачать`}
                </ColorButton>
            </div>
            {visibleImageWindow && (
                <ShadowWindow
                    imageSrc={[...operationCar.photos, ...newPhotos]}
                    onClose={() => setVisibleImageWindow(false)}
                />
            )}
        </div>
    );
};

export default OperationCarCard;