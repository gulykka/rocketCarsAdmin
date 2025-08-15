import React from 'react';
import {Navigate} from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux-hooks';

interface PrivateRouterProps {
    element: React.ReactElement,
}

const PrivateRouter = ({element} : PrivateRouterProps) => {
    const isAuth = useAppSelector(state => state.data.isAuth);
    return (
        <>
            {(isAuth) ? element : <Navigate to={'/'}/>}
        </>
    )
};

export default PrivateRouter;
