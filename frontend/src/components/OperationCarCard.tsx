import React, {FC, useState} from 'react';
import ColorButton from './UI/ColorButton';
import {getOffset, getStatusCode} from '../status';
import {ICar} from '../interfaces';
import ShadowWindow from './ShadowWindow';
import {formatDateToDDMMYYYY} from '../functions/changeDate';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import {useAppSelector} from "../hooks/redux-hooks";
import {API_URI} from "../API_URI";

interface OperationCarCardProps {
    operationCar: ICar;
}

const OperationCarCard: FC<OperationCarCardProps> = ({operationCar}) => {
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [newPhotos, setNewPhotos] = useState<string[]>([]); // доп. фото для просмотра
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false)

    const agent_id = useAppSelector(state => state.data.data?.user.id)
    const code = operationCar.status.level;
    const currentStatus = code ?? 0;

    /**
     * Подгрузка дополнительных фото для просмотра
     */
    const getPhotos = async () => {
        try {
            setLoading(true);
            const url = API_URI.load_photos + `${operationCar.parent_id}`
            const response = await fetch(
                url,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const photosData = await response.json();

            if (response.ok) {
                setNewPhotos(photosData.photos);
                setVisibleImageWindow(true);
            }
        } catch (e: any) {
            console.error('Ошибка при загрузке фото для просмотра:', e);
        } finally {
            setLoading(false);
            setVisibleImageWindow(true)
        }
    };

    async function downloadPhotos() {
        try {
            setDownloading(true);
            const url_ = API_URI.download_photos + `${operationCar.parent_id}/${agent_id}/${operationCar.id}/${operationCar.name}/${operationCar.VIN}`
            const response = await fetch(
                url_,
                {
                    method: 'GET',
                    // ⚠️ Убираем 'Content-Type': 'application/json' — это не тело запроса
                    // Заголовок нужен только если отправляешь данные
                }
            );

            // Проверяем, успешен ли ответ
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
            }

            // 🔑 Получаем ZIP-файл как Blob
            const blob = await response.blob();

            // 📝 Извлекаем имя файла из заголовка Content-Disposition
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `${operationCar.name}_${operationCar.VIN}.zip`; // fallback

            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                    filename = match[1].replace(/['"]/g, ''); // убираем кавычки
                }
            }

            // 💾 Создаём ссылку и "скачиваем" файл
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // имя файла при скачивании
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); // чистим память

            console.log('Фото успешно скачаны:', filename);
        } catch (e: any) {
            console.error('Ошибка при скачивании фото:', e);
        } finally {
            setDownloading(false);
        }
    }


    return (
        <div
            className={operationCar.photos.length !== 0 ? "operation_car_card_container" : " operation_car_card_container padding"}>
            <div className="information_container_">
                {operationCar.name && <span style={{fontSize: '25px'}}>{operationCar.name}</span>}
                {operationCar.auto && <span>{operationCar.auto}</span>}
                {operationCar.year && <span>{formatDateToDDMMYYYY(operationCar.year)}</span>}
                {operationCar.VIN && <span>{operationCar.VIN}</span>}

                <div className="information_car_status_container">
                    <div style={{width: `${currentStatus * 16.7}%`}} className="line_progress"></div>
                    <div className="line"></div>

                    {[1, 2, 3, 4, 5, 6].map(statusNumber => (
                        <div
                            key={statusNumber}
                            style={{left: `${statusNumber * 16.7}%`}}
                            className={`circle ${statusNumber <= currentStatus ? 'circle_progress' : ''}`}
                        ></div>
                    ))}

                    <span
                        style={{marginLeft: getOffset(getStatusCode(operationCar.status.description))}}
                        className="status_container"
                    >
            <span className="status">{operationCar.status.description}</span>
          </span>
                </div>
            </div>

            {operationCar.photos.length !== 0 &&
                <div className="photos_container">
                    {loading && <span className="title_loading">загрузка...</span>}

                    {operationCar.photos.length !== 0 &&
                        <img
                            onClick={getPhotos}
                            className={loading ? 'photo_car loading' : 'photo_car'}
                            alt="car_photo"
                            src={operationCar.photos[0]}
                            onError={e => {
                                e.currentTarget.src =
                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                            }}
                        />
                    }

                    {operationCar.photos.length !== 0 &&
                        <ColorButton
                            onClick={downloadPhotos}
                            disabled={isDownloading || operationCar.photos.length === 0}
                            title={operationCar.photos.length === 0 ? 'Нет фото для скачивания' : ''}
                        >
                            {downloading ? 'Скачивание...' : 'Скачать'}
                        </ColorButton>
                    }
                </div>

            }
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