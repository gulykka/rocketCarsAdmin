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
    const [visiblePassword, setVisiblePassword] = useState(false); // Для подсказки/анимации
    const [showPassword, setShowPassword] = useState(false);      // Только для отображения пароля

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
            setError(error as string);
        }
    };

    return (
        <div className="form_signin_container">
            {/* Поле логина (без изменений) */}
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
                {(visibleLogin || login) && <label className="background">0</label>}
            </div>

            {/* Поле пароля с глазиком */}
            <div className="input-container">
                <input
                    type={showPassword ? 'text' : 'password'} // 🔁 Управляем через showPassword
                    id="mySecondInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setVisiblePassword(true)}
                    onBlur={() => setVisiblePassword(false)}
                    placeholder=" "
                    disabled={status === 'loading'}
                    className="password-input"
                />
                <label className="placeholder" htmlFor="mySecondInput">
                    Введите пароль
                </label>
                {(visiblePassword || password) && <label className="background_VIN">0</label>}

                {/* Кнопка-глазик */}
                <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                    {showPassword ? (
                        // Глаз ОТКРЫТ (пароль виден)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#E51B2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="#E51B2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    ) : (
                        // Глаз ЗАКРЫТ (пароль скрыт)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#E51B2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="1" y1="1" x2="23" y2="23" stroke="#E51B2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </button>
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