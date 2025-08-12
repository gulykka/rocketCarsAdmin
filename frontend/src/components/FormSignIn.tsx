import React, { useState } from 'react';

const FormSignIn = () => {
    const [visibleName, setVisibleName] = useState(false);
    const [name, setName] = useState('');
    const [visibleVIN, setVisibleVIN] = useState(false);
    const [VIN, setVIN] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!name || !VIN) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        // setLoading(true);
        setError(null);

        try {
            // await dispatch(fetchGetCar({ name, VIN })).unwrap();
            // navigation('/main');
        } catch {
            setError('Что-то пошло не так...');
        } finally {
            // setLoading(false);
        }
    };

    return (
        <div className={'form_signin_container'}>
            <div className="input-container">
                <input
                    type="text"
                    id="myInput"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onFocus={() => setVisibleName(true)}
                    onBlur={() => setVisibleName(false)}
                    placeholder=" "
                    // disabled={loading}
                />
                <label className="placeholder" htmlFor="myInput">Введите логин</label>
                {((visibleName) || (name && !visibleName)) && <label className={'background'}>0</label>}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    id="mySecondInput"
                    onFocus={() => setVisibleVIN(true)}
                    onBlur={() => setVisibleVIN(false)}
                    value={VIN}
                    onChange={(event) => setVIN(event.target.value)}
                    placeholder=" "
                    // disabled={loading}
                />
                <label className="placeholder" htmlFor="mySecondInput">Введите пароль</label>
                {((visibleVIN) || (VIN && !visibleVIN)) && <label className={'background_VIN'}>0</label>}
            </div>

            {(error) && <div className="error-message">{error || 'Что-то пошло не так...'}</div>}
            <button
                onClick={fetchData}
                className={'button_signin'}
                // disabled={loading}
            >
                {'Проверить'}
            </button>
        </div>
    );
};

export default FormSignIn;
