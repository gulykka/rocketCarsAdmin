import React from 'react';
import {Route, Routes} from "react-router-dom";
import LogInPage from "../../pages/LogInPage";
import NotFoundPage from "../../pages/NotFoundPage";
import CarOperationPage from "../../pages/CarOperationPage";
import CompletedCarPage from "../../pages/CompletedCarPage";
import ProfilePage from "../../pages/ProfilePage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={'/'} element={<LogInPage />} />
            <Route path={'/operation'} element={<CarOperationPage />} />
            <Route path={'/completed'} element={<CompletedCarPage />} />
            <Route path={'/profile'} element={<ProfilePage />} />
            <Route path={'*'} element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter;