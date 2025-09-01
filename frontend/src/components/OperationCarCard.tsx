import React, { FC, useState, useEffect } from 'react';
import ColorButton from './UI/ColorButton';
import { getOffset, getStatusCode } from '../status';
import { ICar } from '../interfaces';
import ShadowWindow from './ShadowWindow';
import { formatDateToDDMMYYYY } from '../functions/changeDate';
import { useAppSelector } from '../hooks/redux-hooks';
import { API_URI } from '../API_URI';

interface OperationCarCardProps {
    operationCar: ICar;
}

const OperationCarCard: FC<OperationCarCardProps> = ({ operationCar }) => {
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const [newPhotos, setNewPhotos] = useState<string[]>([]); // дополнительные фото
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const agent_id = useAppSelector(state => state.data.data?.user.id);
    const code = operationCar.status.level;
    const currentStatus = code ?? 0;
    const fallbackImage = 'image_not_found.png';

    // Анимация точек: "загрузка." → "загрузка.." → "загрузка..."
    const LoadingDots = () => {
        const [dots, setDots] = useState('');

        useEffect(() => {
            const interval = setInterval(() => {
                setDots(prev => (prev.length >= 5 ? '' : prev + '.'));
            }, 500);

            return () => clearInterval(interval);
        }, []);

        return <span>загрузка{dots}</span>;
    };

    // Анимация точек: "Скачивание." → "Скачивание.." → "Скачивание..."
    const DownloadingDots = () => {
        const [dots, setDots] = useState('');

        useEffect(() => {
            if (!downloading) return;
            const interval = setInterval(() => {
                setDots(prev => (prev.length >= 5 ? '' : prev + '.'));
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
            const url = API_URI.load_photos + `${operationCar.parent_id}/${agent_id}/${operationCar.id}`;
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
    async function downloadPhotos() {
        try {
            setDownloading(true);
            const url_ = API_URI.download_photos + `${operationCar.parent_id}/${agent_id}/${operationCar.id}/${operationCar.name}/${operationCar.VIN}`;
            const response = await fetch(url_, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `${operationCar.name}_${operationCar.VIN}.zip`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            console.log('Фото успешно скачаны:', filename);
        } catch (e: any) {
            console.error('Ошибка при скачивании фото:', e);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div
            className={
                operationCar.photos.length !== 0
                    ? 'operation_car_card_container'
                    : 'operation_car_card_container padding'
            }
        >
            {/* Информация об авто */}
            <div className="information_container">
                {operationCar.name ? (
                    <span style={{ fontSize: '25px' }}>{operationCar.name}</span>
                ) : (
                    <div className="not_visible">k</div>
                )}

                {operationCar.auto ? (
                    <span>{operationCar.auto}</span>
                ) : (
                    <div className="not_visible">k</div>
                )}

                {operationCar.year ? (
                    <span>{formatDateToDDMMYYYY(operationCar.year)}</span>
                ) : (
                    <div className="not_visible">k</div>
                )}

                {operationCar.VIN ? (
                    <span>{operationCar.VIN}</span>
                ) : (
                    <div className="not_visible">k</div>
                )}

                <div className="not_visible">k</div>

                {/* Прогресс-бар статуса */}
                <div className="information_car_status_container">
                    <div style={{ width: `${currentStatus * 16.7}%` }} className="line_progress"></div>
                    <div className="line"></div>

                    {[1, 2, 3, 4, 5, 6].map(statusNumber => (
                        <div
                            key={statusNumber}
                            style={{ left: `${statusNumber * 16.7}%` }}
                            className={`circle ${statusNumber <= currentStatus ? 'circle_progress' : ''}`}
                        ></div>
                    ))}

                    <span
                        style={{ marginLeft: getOffset(getStatusCode(operationCar.status.description)) }}
                        className="status_container"
                    >
                        <span className="status">{operationCar.status.description}</span>
                    </span>
                </div>
            </div>

            {/* Блок фото */}
            <div className="photos_container">
                {loading && <span className="title_loading"><LoadingDots /></span>}

                {operationCar.photos.length !== 0 ? (
                    <img
                        style={{ cursor: 'pointer' }}
                        onClick={getPhotos}
                        className={loading ? 'photo_car loading' : 'photo_car'}
                        alt="car_photo"
                        src={operationCar.photos[0]}
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

                {operationCar.photos.length !== 0 && (
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
                    imageSrc={[...operationCar.photos, ...newPhotos]}
                    onClose={() => setVisibleImageWindow(false)}
                />
            )}
        </div>
    );
};

export default OperationCarCard;