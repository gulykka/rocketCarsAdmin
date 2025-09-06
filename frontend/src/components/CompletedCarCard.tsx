import React, { FC, useState, useEffect } from 'react';
import { ICar } from '../interfaces';
import ColorButton from './UI/ColorButton';
import ShadowWindow from './ShadowWindow';
import { formatDateToDDMMYYYY } from '../functions/changeDate';
import { useAppSelector } from '../hooks/redux-hooks';
import { API_URI } from '../API_URI';

interface CompletedCarCardProps {
    completedCar: ICar;
}

const CompletedCarCard: FC<CompletedCarCardProps> = ({ completedCar }) => {
    const [chosenPhoto, setChosenPhoto] = useState(0);
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const [newPhotos, setNewPhotos] = useState<string[]>([]); // доп. фото для просмотра
    const [loading, setLoading] = useState(false); // загрузка доп. фото
    const [downloading, setDownloading] = useState(false); // скачивание ZIP

    const fallbackImage = 'image_not_found.png';
    const agent_id = useAppSelector(state => state.data.data?.user.id);

    // Анимация: "загрузка." → "загрузка.." → "загрузка..."
    const LoadingDots = () => {
        const [dots, setDots] = useState('');

        useEffect(() => {
            const interval = setInterval(() => {
                setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
            }, 500);
            return () => clearInterval(interval);
        }, []);

        return <span>загрузка{dots}</span>;
    };

    // Анимация: "Скачивание." → "Скачивание.." → "Скачивание..."
    const DownloadingDots = () => {
        const [dots, setDots] = useState('');

        useEffect(() => {
            if (!downloading) return;
            const interval = setInterval(() => {
                setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
            }, 500);
            return () => clearInterval(interval);
        }, [downloading]);

        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '1px' }}>
            Скачивание
            <span style={{ width: '30px', textAlign: 'left', display: 'inline-block' }}>
                {dots}
            </span>
        </span>
        );
    };

    /**
     * Подгрузка дополнительных фото для просмотра
     */
    const getPhotos = async () => {
        try {
            setLoading(true);
            const url = API_URI.load_photos + `${completedCar.parent_id}/${agent_id}/${completedCar.id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const photosData = await response.json();

            if (response.ok) {
                setNewPhotos(photosData.photos);
                setVisibleImageWindow(true);
            } else {
                console.error('Ошибка загрузки фото:', photosData.message);
            }
        } catch (e: any) {
            console.error('Ошибка при загрузке фото для просмотра:', e);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Скачивание фото как ZIP
     */
    const downloadPhotos = async () => {
        try {
            setDownloading(true);
            const url = API_URI.download_photos + `${completedCar.parent_id}/${agent_id}/${completedCar.id}/${completedCar.name}/${completedCar.VIN}`;
            const response = await fetch(url, { method: 'GET' });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `${completedCar.name}_${completedCar.VIN}.zip`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (e: any) {
            console.error('Ошибка при скачивании фото:', e);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div
            className={
                completedCar.photos.length !== 0
                    ? 'completed_car_card_container'
                    : 'completed_car_card_container padding_'
            }
        >
            {/* Информация */}
            <div className="information_container">
                {completedCar.name && <span style={{ fontSize: '25px' }}>{completedCar.name}</span>}
                {completedCar.auto && <span>{completedCar.auto}</span>}
                {completedCar.year && <span>{formatDateToDDMMYYYY(completedCar.year)}</span>}
                {completedCar.VIN && <span>{completedCar.VIN}</span>}

                <div className="information_car_completed_status_container">
                    {completedCar.status.datetime && (
                        <span className="status_completed_container">
                            <span className="status_completed">{completedCar.status.datetime}</span>
                        </span>
                    )}
                    <span style={{ textAlign: 'center' }}>{completedCar.status.description}</span>
                </div>
            </div>

            {/* Фото и кнопка */}
            <div className="photos_container">
                {loading && <span className="title_loading"><LoadingDots /></span>}

                {completedCar.photos.length > 0 ? (
                    <img
                        style={{ cursor: 'pointer' }}
                        onClick={getPhotos}
                        className={loading ? 'photo_car loading' : 'photo_car'}
                        alt="car_photo"
                        src={completedCar.photos[0]}
                        onError={e => {
                            e.currentTarget.src = fallbackImage;
                        }}
                    />
                ) : (
                    <img
                        className="photo_car"
                        alt="car_photo"
                        src="no_photos.jpg"
                        onError={e => {
                            e.currentTarget.src = fallbackImage;
                        }}
                    />
                )}

                {completedCar.photos.length !== 0 && (
                    <ColorButton
                        onClick={downloadPhotos}
                        disabled={downloading}
                        title=""
                    >
                        {downloading ? <DownloadingDots /> : 'Скачать'}
                    </ColorButton>
                )}
            </div>

            {/* Модальное окно с фото */}
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