import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { fetchSignIn } from '../store/slices/carSlice';
import { useNavigate } from 'react-router-dom';

const FormSignIn = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [visibleLogin, setVisibleLogin] = useState(false);
    const [password, setPassword] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const status = useAppSelector((state) => state.data.status);

    const fetchData = async () => {
        if (!login || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setError(null);

        try {
            await dispatch(fetchSignIn({ login, password })).unwrap();
            navigate('/profile');
        } catch (error) {
            // Ошибка из rejectWithValue — строка
            setError(error as string);
        }
    };

    return (
        <div className="form_signin_container">
            <div className="input-container">
                <input
                    type="text"
                    id="myInput"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    onFocus={() => setVisibleLogin(true)}
                    onBlur={() => setVisibleLogin(false)}
                    placeholder=" "
                    disabled={status === 'loading'}
                />
                <label className="placeholder" htmlFor="myInput">
                    Введите логин
                </label>
                {(visibleLogin || (!visibleLogin && login)) && (
                    <label className="background">0</label>
                )}
            </div>

            <div className="input-container">
                <input
                    type="password"
                    id="mySecondInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setVisiblePassword(true)}
                    onBlur={() => setVisiblePassword(false)}
                    placeholder=" "
                    disabled={status === 'loading'}
                />
                <label className="placeholder" htmlFor="mySecondInput">
                    Введите пароль
                </label>
                {(visiblePassword || (password && !visiblePassword)) && (
                    <label className="background_VIN">0</label>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
                onClick={fetchData}
                className="button_signin"
                disabled={status === 'loading'}
            >
                {status === 'loading' ? 'Вход...' : 'Войти'}
            </button>
        </div>
    );
};

export default FormSignIn;