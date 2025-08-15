import React, { useState } from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {fetchSignIn} from "../store/slices/carSlice";

const FormSignIn = () => {
    const dispatch = useAppDispatch();

    const [visibleLogin, setVisibleLogin] = useState(false);
    const [login, setLogin] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const server_error = useAppSelector(state => state.data.error)
    const status = useAppSelector(state => state.data.status)

    const fetchData = async () => {
        if (!login || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setError(null);

        try {
            await dispatch(fetchSignIn({ login, password })).unwrap();
        } catch {
            setError(server_error);
        } finally {

        }
    };

    return (
        <div className={'form_signin_container'}>
            <div className="input-container">
                <input
                    type="text"
                    id="myInput"
                    value={login}
                    onChange={(event) => setLogin(event.target.value)}
                    onFocus={() => setVisibleLogin(true)}
                    onBlur={() => setVisibleLogin(false)}
                    placeholder=" "
                    // disabled={loading}
                />
                <label className="placeholder" htmlFor="myInput">Введите логин</label>
                {((visibleLogin) || (login && !visibleLogin)) && <label className={'background'}>0</label>}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    id="mySecondInput"
                    onFocus={() => setVisiblePassword(true)}
                    onBlur={() => setVisiblePassword(false)}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder=" "
                    // disabled={loading}
                />
                <label className="placeholder" htmlFor="mySecondInput">Введите пароль</label>
                {((visiblePassword) || (password && !visiblePassword)) && <label className={'background_VIN'}>0</label>}
            </div>

            {(error) && <div className="error-message">{error || 'Что-то пошло не так...'}</div>}
            <button
                onClick={fetchData}
                className={'button_signin'}
                disabled={status === 'loading'}
            >
                {'Проверить'}
            </button>
        </div>
    );
};

export default FormSignIn;
