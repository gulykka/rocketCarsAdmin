import React from 'react';
import './login.sass'
import FormSignIn from "./FormSignIn";

const Login = () => {
    return (
        <div className={'login_container'}>
            <img src={'logo.png'} alt={''} className={'img_logo'}/>
            <label className={'title'}>Личный кабинет агента</label>
            <FormSignIn />
        </div>
    );
};

export default Login;