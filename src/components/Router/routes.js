import MainLayout from '../Layouts/MainLayout/MainLayout';
import PublicLayout from '../Layouts/PublicLayout/PublicLayout';
import LoginPage from '../Login/LoginPage';
import logout from './logout';

const routes = [
    {
        path: '/',
        component: null,
        layout: MainLayout,
        exact: true,
    },
    {
        path: '/login',
        component: LoginPage,
        layout: PublicLayout,
        isPublic: true,
    },
    {
        path: '/logout',
        component: () => logout(),
        layout: PublicLayout,
    },
];

export default routes;
