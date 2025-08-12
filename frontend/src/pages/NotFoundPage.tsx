import React from 'react';
import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className={'not_found_page_container'}>
            <h1>404</h1>
            <h2>Страница не найдена</h2>
            <p>К сожалению, запрашиваемая вами страница не существует.</p>
            <Link to="/" className="home-link">Вернуться на главную страницу</Link>
        </div>
    );
};

export default NotFoundPage;