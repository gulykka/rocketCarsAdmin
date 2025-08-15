import React, {use, useState} from 'react';
import ColorButton from "./UI/ColorButton";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {deleteServerMessage, fetchChangePassword, setServer} from "../store/slices/carSlice";

const ChangePassword = () => {
    const dispatch = useAppDispatch();

    const [oldPassword, setOldPassword] = useState('')
    const [visibleOldPassword, setVisibleOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('')
    const [visibleNewPassword, setVisibleNewPassword] = useState(false);
    const [repeatNewPassword, setRepeatNewPassword] = useState('')
    const [visibleRepeatNewPassword, setVisibleRepeatNewPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const server_error = useAppSelector(state => state.data.error)
    const server_message = useAppSelector(state => state.data.server_message)
    const status = useAppSelector(state => state.data.status)

    const login = 'login'

    function changePassword() {
        if (!oldPassword || !newPassword || !repeatNewPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        if (newPassword !== repeatNewPassword) {
            setError('Пароли не совпадают!')
            return;
        }

        setError(null)

        try {
            // dispatch(fetchChangePassword({oldPassword, login, newPassword}))
            dispatch(setServer())
            setOldPassword('')
            setNewPassword('')
            setRepeatNewPassword('')
            setTimeout(() => dispatch(deleteServerMessage()), 2000)
        } catch {
            setError(server_error);
        }
    }


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
            {
                error &&
                <span className={'error'}>{error}</span>
            }
            {
                server_message &&
                <span className={'succeeded'}>{server_message}</span>
            }
            <ColorButton
                onClick={changePassword}
                className={'save'}>Сохранить</ColorButton>
        </div>
    );
};

export default ChangePassword;