import React, {useState} from 'react';
import ColorButton from "./UI/ColorButton";
import ShadowWindow from "./ShadowWindow";

const Profile = () => {

    const [visibleImageWindow, setVisibleImageWindow] = useState(false);

    const informationPerson = {
        name: 'Иванов Иван Иванович',
        workOperationCars: 2,
        completedCars: 2,
        managerName: 'Петров Пётр Петрович'
    }

    return (
        <div className={'profile_container'}>
            <div className={'informations_person_container'}>
                <span>{informationPerson.name}</span>
                <span>Количество выданных машин: {informationPerson.completedCars}</span>
                <span>Количество машин в работе: {informationPerson.workOperationCars}</span>
                <div className={'change_password_container'}>
                    <span>Ваш личный менеджер:</span>
                    <span>{informationPerson.managerName}</span>
                    <img src={'whatsapp.png'} className={'whatsapp'}/>
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