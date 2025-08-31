import React, {useEffect, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import ShadowWindow from "./ShadowWindow";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {deleteServerMessage} from "../store/slices/carSlice";

const Profile = () => {
    const dispatch = useAppDispatch()

    const [visibleImageWindow, setVisibleImageWindow] = useState(false);

    const count_completed_cars = useAppSelector(state => {
        return (state.data.data?.cars ?? [])
            .filter(car => car?.status?.level === 6)
            .length;
    })

    const count_optional_cars = useAppSelector(state => {
        return (state.data.data?.cars ?? [])
            .filter(car => car?.status?.level !== 6)
            .length;
    })

    const user = useAppSelector(state => state.data.data?.user)
    const manager = useAppSelector(state => state.data.data?.manager)
    const server_message = useAppSelector(state => state.data.server_message)

    useEffect(() => {
        setTimeout(() => dispatch(deleteServerMessage()), 2000)
    }, [server_message])

    const openWhatsApp = () => {
        if (!manager?.number) return;

        // Очищаем номер от всех нецифровых символов, кроме +
        const cleanedNumber = manager.number.replace(/[^\d+]/g, '');
        console.log(cleanedNumber)

        // Формируем сообщение
        const message = `Здравствуйте! Меня зовут ${user?.name || 'пользователь'}. У меня вопрос по автомобилям.`;

        // Создаем ссылку для WhatsApp
        const whatsappUrl = `https://wa.me/79638398888?text=${encodeURIComponent(message)}`;

        // Открываем в новом окне
        window.open(whatsappUrl, '_blank');
    }

    // Функция для обычного звонка
    const makePhoneCall = () => {
        if (!manager?.number) return;

        // Очищаем номер для tel: ссылки
        const cleanedNumber = manager.number.replace(/[^\d+]/g, '');
        window.open(`tel:${cleanedNumber}`, '_self');
    }

    return (
        <div className={'profile_container'}>
            <div className={'informations_person_container'}>
                <span style={{fontSize: '25px'}}>{user?.name}</span>
                <span>Количество выданных машин: {count_completed_cars}</span>
                <span>Количество машин в работе: {count_optional_cars}</span>
                <div className="info">
                  <span>Ваш личный менеджер:</span>
                  <div className={'number'}>
                      <span>{manager?.name}</span>
                      <button
                          className={'whatsapp'}
                          onClick={openWhatsApp}>
                          <img
                              src="whatsapp_1.png"
                              alt="WhatsApp"
                              style={{ width: '24px', height: '24px'}}
                          />
                      </button>
                  </div>
                </div>
            </div>
            <ColorButton onClick={() => setVisibleImageWindow(true)}>Сменить пароль</ColorButton>
            {visibleImageWindow && (
                <ShadowWindow
                    onClose={() => setVisibleImageWindow(false)}
                />
            )}

        </div>
    );
};

export default Profile;