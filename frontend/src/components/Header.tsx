import React, {useEffect, useState} from 'react';
import './components.sass'
import GreyButton from "./UI/GreyButton";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux-hooks";
import {signOut} from "../store/slices/carSlice";

const Header = () => {
    const dispatch = useAppDispatch()
    const [isVisible, setIsVisible] = useState(false)
    const location = useLocation().pathname

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsVisible(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible]);

    function SignOut() {
        dispatch(signOut())
    }

    return (
        <header className={location === '/' ? 'none' : ''}>
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
                    onClick={SignOut}
                    className={'home_button'}>
                    <img
                        className={'out_button_img'}
                        src={'signout_button.png'}
                        alt={'Выйти'}/>
                </button>
                <button
                    title={'Выйти'}
                    onClick={() => setIsVisible(!isVisible)}
                    className={'menu_button'}>
                    <img
                        className={isVisible ? 'out_button_img cancel_button' : 'out_button_img'}
                        src={isVisible ? 'cancel.png' : 'menu.png'}
                        alt={'Выйти'}/>
                </button>
            </div>
            <div className={isVisible ? 'overlay_' : 'none'} onClick={() => setIsVisible(false)}/>
            <div className={isVisible ? 'popup_menu_container' : 'none'}>
                <Link
                    onClick={() => setIsVisible(false)}
                    to={'/profile'}
                    className={location === '/profile' ? 'grey_popup_menu_link' : 'popup_menu_link'}>
                    Личный кабинет
                </Link>
                <Link
                    onClick={() => setIsVisible(false)}
                    to={'/completed'}
                    className={location === '/completed' ? 'grey_popup_menu_link' : 'popup_menu_link'}>
                    Авто в работе
                </Link>
                <Link
                    onClick={() => setIsVisible(false)}
                    to={'/operation'}
                    className={location === '/operation' ? 'grey_popup_menu_link' : 'popup_menu_link'}>
                    Выданные авто
                </Link>
                <Link
                    onClick={SignOut}
                    to={''}
                    className={'popup_menu_link'}>
                    Выйти
                </Link>
            </div>
        </header>
    );
};

export default Header;