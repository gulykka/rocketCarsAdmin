import React, {useState} from 'react';
import ColorButton from "./UI/ColorButton";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('')
    const [visibleOldPassword, setVisibleOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('')
    const [visibleNewPassword, setVisibleNewPassword] = useState(false);
    const [repeatNewPassword, setRepeatNewPassword] = useState('')
    const [visibleRepeatNewPassword, setVisibleRepeatNewPassword] = useState(false);

    return (
        <div className={'change_password_window_container'}>
            <div className="input-container_">
                <input
                    className={'change_input'}
                    type="text"
                    id="myInput"
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    onFocus={() => setVisibleOldPassword(true)}
                    onBlur={() => setVisibleOldPassword(false)}
                    placeholder=" "
                    // disabled={loading}
                />
                <label className="placeholder_" htmlFor="myInput">Введите старый пароль</label>
                {((visibleOldPassword) || (oldPassword && !visibleOldPassword)) && <label className={'background_old'}>0</label>}
            </div>
            <div className="input-container_">
                <input
                    className={'change_input'}
                    type="text"
                    id="myInput"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    onFocus={() => setVisibleNewPassword(true)}
                    onBlur={() => setVisibleNewPassword(false)}
                    placeholder=" "
                    // disabled={loading}
                />
                <label className="placeholder_" htmlFor="myInput">Введите новый пароль</label>
                {((visibleNewPassword) || (newPassword && !visibleNewPassword)) && <label className={'background_new'}>0</label>}
            </div>
            <div className="input-container_">
                <input
                    className={'change_input'}
                    type="text"
                    id="myInput"
                    value={repeatNewPassword}
                    onChange={(event) => setRepeatNewPassword(event.target.value)}
                    onFocus={() => setVisibleRepeatNewPassword(true)}
                    onBlur={() => setVisibleRepeatNewPassword(false)}
                    placeholder=" "
                    // disabled={loading}
                />
                <label className="placeholder_" htmlFor="myInput">Повторите новый пароль</label>
                {((visibleRepeatNewPassword) || (repeatNewPassword && !visibleRepeatNewPassword)) && <label className={'background_new_'}>0</label>}
            </div>


            <ColorButton className={'save'}>Сохранить</ColorButton>
        </div>
    );
};

export default ChangePassword;