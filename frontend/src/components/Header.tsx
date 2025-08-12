import React from 'react';
import './components.sass'
import GreyButton from "./UI/GreyButton";
import {Link, useLocation} from "react-router-dom";

const Header = () => {

    const location = useLocation().pathname

    return (
        <header>
            <div className={'navigation'}>
                <img className={'img_logo_mini'} src={'logo.png'}/>
                <Link
                    className={'navigation_link'}
                    to={'/operation'}>
                    <GreyButton className={location === '/operation' ? 'grey_navigation_link' : ' '}>Авто в работе</GreyButton>
                </Link>
                <Link
                    className={'navigation_link'}
                    to={'/completed'}>
                    <GreyButton className={location === '/completed' ? 'grey_navigation_link' : ' '}>Выданные авто</GreyButton></Link>
            </div>
            <div className={'navigation'}>

                <Link
                    className={'navigation_link'}
                    to={'/profile'}>
                    <button
                        className={location === '/profile' ? 'grey_navigation_link home_button' : 'home_button'}
                        title={'Главная страница'}>
                        <img
                            className={'home_button_img'}
                            src={'home_button.png'}
                            alt={'Главная страница'}/>
                    </button>
                </Link>
                <button
                    title={'Выйти'}
                    className={'home_button'}>
                    <img
                        className={'out_button_img'}
                        src={'signout_button.png'}
                        alt={'Выйти'}/>
                </button>
            </div>
        </header>
    );
};

export default Header;