import React, { useState } from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {fetchSignIn, signIn} from "../store/slices/carSlice";
import {useNavigate} from "react-router-dom";

const FormSignIn = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigate();

    const [visibleLogin, setVisibleLogin] = useState(false);
    const [login, setLogin] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const server_error = useAppSelector(state => state.data.error)
    const status = useAppSelector(state => state.data.status)

    const login_r = useAppSelector(state => state.data.login) //d
    const password_r = useAppSelector(state => state.data.password) //d

    const fetchData = async () => {
        if (!login || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setError(null);

        if (password === password_r && login === login_r) {
            dispatch(signIn())
            navigation('/operation')
        } else {
            setError('Что-то пошло не так! Попробуйте еще раз.')
        }


        // try {
        //     // await dispatch(fetchSignIn({ login, password })).unwrap(); //v
        // } catch {
        //     setError(server_error);
        // } finally {
        //
        // }
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
