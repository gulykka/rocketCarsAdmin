import React from 'react';
import {Route, Routes} from "react-router-dom";
import LogInPage from "../../pages/LogInPage";
import NotFoundPage from "../../pages/NotFoundPage";
import CarOperationPage from "../../pages/CarOperationPage";
import CompletedCarPage from "../../pages/CompletedCarPage";
import ProfilePage from "../../pages/ProfilePage";
import PrivateRouter from "./PrivateRouter";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={'/'} element={<LogInPage />} />
            <Route path={'/operation'} element={<PrivateRouter element={<CarOperationPage />} />} />
            <Route path={'/completed'} element={<PrivateRouter element={<CompletedCarPage />} />} />
            <Route path={'/profile'} element={<PrivateRouter element={<ProfilePage />} />} />
            <Route path={'*'} element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter;