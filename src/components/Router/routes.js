import DashboardList from '../Dashboard/DashboardList';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import PublicLayout from '../Layouts/PublicLayout/PublicLayout';
import LoginPage from '../Login/LoginPage';
import SprintList from '../Sprint/SprintList';
import TaskGrid from '../Task/TaskGrid';
import Logout from './Logout';

const routes = [
    {
        path: '/',
        component: DashboardList,
        layout: MainLayout,
        exact: true,
    },
    {
        path: '/dashboard/:id',
        component: SprintList,
        layout: MainLayout,
    },
    {
        path: '/sprint/:id',
        component: TaskGrid,
        layout: MainLayout,
    },
    {
        path: '/login',
        component: LoginPage,
        layout: PublicLayout,
        isPublic: true,
    },
    {
        path: '/logout',
        component: Logout,
        layout: PublicLayout,
    },
];

export default routes;
