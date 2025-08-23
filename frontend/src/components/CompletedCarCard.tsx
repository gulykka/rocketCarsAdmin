import React, { FC, useState } from 'react';
import { ICar } from '../interfaces';
import ColorButton from './UI/ColorButton';
import ShadowWindow from './ShadowWindow';
import { formatDateToDDMMYYYY } from '../functions/changeDate';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface CompletedCarCardProps {
    completedCar: ICar;
}

const CompletedCarCard: FC<CompletedCarCardProps> = ({ completedCar }) => {
    const [chosenPhoto, setChosenPhoto] = useState(0);
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [newPhotos, setNewPhotos] = useState<string[]>([]); // доп. фото для просмотра
    const [loading, setLoading] = useState(false);

    /**
     * Подгрузка дополнительных фото для просмотра
     */
    const getPhotos = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/load-photos/${completedCar.parent_id}/${completedCar.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const photosData = await response.json();
            console.log('load-photos response:', photosData);

            if (response.ok && photosData.status_code === 200 && Array.isArray(photosData.photos)) {
                setNewPhotos(photosData.photos);
                setVisibleImageWindow(true);
            } else {
                alert('Не удалось загрузить фотографии');
            }
        } catch (e: any) {
            console.error('Ошибка при загрузке фото для просмотра:', e);
            alert('Ошибка соединения');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Скачивание всех фото: основные + из /api/download-photos
     */
    const downloadPhotosAsZip = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const imgFolder = zip.folder(`${completedCar.name}_photos`);

            if (!imgFolder) {
                throw new Error('Не удалось создать папку в архиве');
            }

            // Все фото: сначала из completedCar
            let allPhotoUrls: string[] = [...completedCar.photos].filter(
                (url): url is string => typeof url === 'string' && url.trim() !== ''
            );

            // Добавляем фото с /api/download-photos/{parent_id}
            try {
                const response = await fetch(
                    `http://localhost:5000/api/download-photos/${completedCar.parent_id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data.photos)) {
                        const validAdditional = data.photos.filter(
                            (url:any): url is string => typeof url === 'string' && url.trim() !== ''
                        );
                        allPhotoUrls = [...allPhotoUrls, ...validAdditional];
                    }
                } else {
                    console.warn('Не удалось получить фото для скачивания:', await response.text());
                }
            } catch (error) {
                console.warn('Ошибка при загрузке фото для скачивания:', error);
            }

            // Также добавляем фото из /api/load-photos (если хотим, чтобы совпадало с просмотром)
            // Если НЕ нужно — удалите этот блок
            try {
                const response = await fetch(
                    `http://localhost:5000/api/load-photos/${completedCar.parent_id}/${completedCar.id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data.photos)) {
                        const validLoadPhotos = data.photos.filter(
                            (url:any): url is string => typeof url === 'string' && url.trim() !== ''
                        );
                        allPhotoUrls = [...allPhotoUrls, ...validLoadPhotos];
                    }
                }
            } catch (error) {
                console.warn('Ошибка при загрузке load-photos для ZIP:', error);
            }

            // Убираем дубликаты
            allPhotoUrls = [...allPhotoUrls];

            if (allPhotoUrls.length === 0) {
                alert('Нет фотографий для скачивания');
                return;
            }

            // Загружаем каждое фото
            const downloadPromises = allPhotoUrls.map(async (photoUrl, index) => {
                try {
                    const urlWithTimestamp = `${photoUrl}?t=${Date.now()}`;
                    const res = await fetch(urlWithTimestamp, {
                        mode: 'cors',
                        credentials: 'omit',
                        headers: {
                            'Accept': 'image/*',
                        },
                    });

                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const blob = await res.blob();
                    if (!blob.type.startsWith('image/')) throw new Error('Not an image');

                    let ext = 'jpg';
                    if (blob.type === 'image/jpeg') ext = 'jpg';
                    else if (blob.type === 'image/png') ext = 'png';
                    else if (blob.type === 'image/gif') ext = 'gif';
                    else if (blob.type === 'image/webp') ext = 'webp';
                    else {
                        const urlExt = photoUrl.split('.').pop()?.toLowerCase();
                        if (urlExt && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(urlExt)) {
                            ext = urlExt === 'jpeg' ? 'jpg' : urlExt;
                        }
                    }

                    const filename = `${completedCar.name}_photo_${index + 1}.${ext}`;
                    imgFolder.file(filename, blob);
                    return { success: true };
                } catch (error) {
                    console.error(`Ошибка загрузки фото ${index + 1}:`, error);
                    return { success: false };
                }
            });

            const results = await Promise.all(downloadPromises);
            const failed = results.filter(r => !r.success);
            if (failed.length === allPhotoUrls.length) {
                throw new Error('Не удалось загрузить ни одного фото');
            }
            if (failed.length > 0) {
                console.warn(`Предупреждение: ${failed.length} фото не загружено`);
            }

            // Генерация архива
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 },
            });

            const safeName = completedCar.name.replace(/[^a-zA-Z0-9а-яА-Я\s]/g, '').trim();
            const dateStr = formatDateToDDMMYYYY(new Date().toString()).replace(/\./g, '-');
            const zipFilename = `${safeName}_${completedCar.auto}_photos_${dateStr}.zip`;

            saveAs(content, zipFilename);
        } catch (error) {
            console.error('Ошибка при создании ZIP:', error);
            alert('Произошла ошибка при скачивании.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="completed_car_card_container">
            <div className="information_container">
                <span style={{ fontSize: '25px' }}>{completedCar.name}</span>
                <span>{completedCar.auto}</span>
                <span>{completedCar.year}</span>
                <span>{completedCar.VIN}</span>
                <div className="information_car_completed_status_container">
          <span className="status_completed_container">
            <span className="status_completed">
              {formatDateToDDMMYYYY(completedCar.status.datetime)}
            </span>
          </span>
                    <span style={{ textAlign: 'center' }}>{completedCar.status.description}</span>
                </div>
            </div>

            <div className="photos_container">
                {loading && <span className="title_loading">загрузка...</span>}
                {completedCar.photos.length !== 0 &&
                    <img
                        onClick={getPhotos}
                        className={loading ? 'photo_car loading' : 'photo_car'}
                        alt="car_photo"
                        src={completedCar.photos[0]}
                        onError={(e) => {
                            e.currentTarget.src =
                                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                        }}
                    />
                }
                <ColorButton
                    onClick={downloadPhotosAsZip}
                    disabled={isDownloading || completedCar.photos.length === 0}
                    title={completedCar.photos.length === 0 ? 'Нет фото для скачивания' : ''}
                >
                    {isDownloading ? 'Скачивание...' : 'Скачать'}
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