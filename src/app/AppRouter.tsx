
import {Navigate, Route, Routes} from 'react-router-dom';
import { publicRoutes } from './router';

const AppRouter = () => {
    return (    
            <Routes>
                {publicRoutes.map((route) => (
                    <Route path={route.path}
                           element={<route.component/>}
                           key={route.path} />))}
                <Route path="/"
                       element={<Navigate to='/all-users' replace/>}/>
                <Route path="*"
                       element={<Navigate to='/all-users' replace/>}/>
            </Routes>
    );
};

export default AppRouter;