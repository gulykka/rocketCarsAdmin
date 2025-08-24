import React, { FC, useState } from 'react';
import { ICar } from '../interfaces';
import ColorButton from './UI/ColorButton';
import ShadowWindow from './ShadowWindow';
import { formatDateToDDMMYYYY } from '../functions/changeDate';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import carCompleted from "./CarCompleted";
import {useAppSelector} from "../hooks/redux-hooks";

interface CompletedCarCardProps {
    completedCar: ICar;
}

const CompletedCarCard: FC<CompletedCarCardProps> = ({ completedCar }) => {
    const [chosenPhoto, setChosenPhoto] = useState(0);
    const [visibleImageWindow, setVisibleImageWindow] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [newPhotos, setNewPhotos] = useState<string[]>([]); // доп. фото для просмотра
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false)

    const agent_id = useAppSelector(state => state.data.data?.user.id)


    const getPhotos = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/load-photo/${completedCar.parent_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const photosData = await response.json();
            console.log('load-photos response:', photosData);

            if (response.ok) {
                setNewPhotos(photosData.photos);
                console.log(newPhotos)
                setVisibleImageWindow(true);
            }
        } catch (e: any) {
            console.error('Ошибка при загрузке фото для просмотра:', e);
            alert('Ошибка соединения');
        } finally {
            setLoading(false);
            setVisibleImageWindow(true)
        }
    };

    async function downloadPhotos() {
        try {
            setDownloading(true);

            const response = await fetch(
                `http://localhost:5000/api/download-photos/${completedCar.parent_id}/${agent_id}/${completedCar.id}/${completedCar.name}/${completedCar.VIN}`,
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
            let filename = `${completedCar.name}_${completedCar.VIN}.zip`; // fallback

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

            // Дополнительная диагностика
            if (e.message.includes('Failed to fetch')) {
                alert('Не удалось подключиться к серверу. Проверь URL и доступность бэкенда.');
            } else {
                alert(`Ошибка: ${e.message}`);
            }
        } finally {
            setDownloading(false);
        }
    }


    return (
        <div className={completedCar.photos.length !== 0 ? "completed_car_card_container" : " completed_car_card_container padding"}>
            <div className="information_container">
                {completedCar.name &&
                    <span style={{ fontSize: '25px' }}>{completedCar.name}</span>
                }
                {completedCar.auto && <span>{completedCar.auto}</span>}
                {completedCar.year && <span>{formatDateToDDMMYYYY(completedCar.year)}</span>}
                {completedCar.VIN && <span>{completedCar.VIN}</span>}
                <div className="information_car_completed_status_container">
                    {completedCar.status.datetime && <span className="status_completed_container">
            <span className="status_completed">
                {completedCar.status.datetime}
            </span>
          </span>
                    }
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
                        // onError={(e) => {
                        //     e.currentTarget.src =
                        //         'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                        // }}
                    />
                }
                {completedCar.photos.length !== 0 &&
                    <ColorButton
                        onClick={downloadPhotos}
                        disabled={isDownloading || completedCar.photos.length === 0}
                        title={completedCar.photos.length === 0 ? 'Нет фото для скачивания' : ''}
                    >
                        {downloading ? 'Скачивание...' : 'Скачать'}
                    </ColorButton>
                }
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