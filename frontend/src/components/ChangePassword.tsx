import React, { useState } from 'react'; // ✅ убран `use`
import ColorButton from './UI/ColorButton';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { fetchChangePassword, deleteServerMessage } from '../store/slices/carSlice';

const ChangePassword = () => {
    const dispatch = useAppDispatch();

    const userId = useAppSelector(state => state.data.data?.user?.id);

    const [oldPassword, setOldPassword] = useState('');
    const [visibleOldPassword, setVisibleOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [visibleNewPassword, setVisibleNewPassword] = useState(false);
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [visibleRepeatNewPassword, setVisibleRepeatNewPassword] = useState(false);

    const error = useAppSelector(state => state.data.error);
    const serverMessage = useAppSelector(state => state.data.server_message);
    const status = useAppSelector(state => state.data.status);

    const handleChangePassword = async () => {
        // Сброс ошибок
        if (!oldPassword || !newPassword || !repeatNewPassword) {
            // Можно оставить локальную валидацию
            return;
        }

        if (newPassword !== repeatNewPassword) {
            // setError('Пароли не совпадают!');
            return;
        }

        // Отправляем запрос
        try {
            await dispatch(fetchChangePassword({
                id: userId,
                oldPassword,
                newPassword
            })).unwrap(); // ✅ unwrap() выбросит ошибку, если reject

            // Сброс полей
            setOldPassword('');
            setNewPassword('');
            setRepeatNewPassword('');

            // Автоочистка сообщения через 2 сек
            setTimeout(() => {
                dispatch(deleteServerMessage());
            }, 2000);
        } catch (err: any) {
            // err — это payload из rejectWithValue
            console.error('Ошибка смены пароля:', err);
            // Можно установить локальную ошибку, если нужно
        }
    };

    return (
        <div className="change_password_window_container">
            <span style={{ fontSize: '25px' }}>Смена пароля</span>

            <div className="input-container_">
                <input
                    className="change_input"
                    type={visibleOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    onFocus={() => setVisibleOldPassword(true)}
                    onBlur={() => setVisibleOldPassword(false)}
                    placeholder=" "
                />
                <label className="placeholder_" htmlFor="old-pass">Введите старый пароль</label>
                {(visibleOldPassword || oldPassword) && <label className="background_old">0</label>}
            </div>

            <div className="input-container_">
                <input
                    className="change_input"
                    type={visibleNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    onFocus={() => setVisibleNewPassword(true)}
                    onBlur={() => setVisibleNewPassword(false)}
                    placeholder=" "
                />
                <label className="placeholder_" htmlFor="new-pass">Введите новый пароль</label>
                {(visibleNewPassword || newPassword) && <label className="background_new">0</label>}
            </div>

            <div className="input-container_">
                <input
                    className="change_input"
                    type={visibleRepeatNewPassword ? 'text' : 'password'}
                    value={repeatNewPassword}
                    onChange={e => setRepeatNewPassword(e.target.value)}
                    onFocus={() => setVisibleRepeatNewPassword(true)}
                    onBlur={() => setVisibleRepeatNewPassword(false)}
                    placeholder=" "
                />
                <label className="placeholder_" htmlFor="repeat-pass">Повторите новый пароль</label>
                {(visibleRepeatNewPassword || repeatNewPassword) && <label className="background_new_">0</label>}
            </div>

            {error && <span className="error">{error}</span>}
            {serverMessage && <span className="succeeded">{serverMessage}</span>}

            <ColorButton
                onClick={handleChangePassword}
                disabled={status === 'loading'}
                className="save"
            >
                {status === 'loading' ? 'Сохранение...' : 'Сохранить'}
            </ColorButton>
        </div>
    );
};

export default ChangePassword;