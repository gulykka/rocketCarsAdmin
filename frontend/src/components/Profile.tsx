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


    return (
        <div className={'profile_container'}>
            <div className={'informations_person_container'}>
                <span>{user?.name}</span>
                <span>Количество выданных машин: {count_completed_cars}</span>
                <span>Количество машин в работе: {count_optional_cars}</span>
                <div className={'change_password_container'}>
                    <span>Ваш личный менеджер:</span>
                    <div className={'info'}>
                        <span>{manager?.name}</span>
                        <img src={'whatsapp.png'} className={'whatsapp'}/>
                    </div>
                </div>
            </div>
            <ColorButton onClick={() => setVisibleImageWindow(true)}>Задать новый пароль</ColorButton>
            {visibleImageWindow && (
                <ShadowWindow
                    onClose={() => setVisibleImageWindow(false)}
                />
            )}

        </div>
    );
};

export default Profile;