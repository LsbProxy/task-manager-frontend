import DashboardList from '../Dashboard/DashboardList';
import { FC } from 'react';
import LoginPage from '../LoginPage';
import Logout from './Logout';
import MainLayout from '../Layouts/MainLayout';
import PublicLayout from '../Layouts/PublicLayout';
import RegisterPage from '../RegisterPage';
import SprintList from '../Sprint/SprintList';
import TaskGrid from '../Task/TaskGrid';

interface Route {
	path: string;
	component: FC;
	layout: FC;
	exact?: boolean;
	isPublic?: boolean;
}

const routes: Route[] = [
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
	{
		path: '/register',
		component: RegisterPage,
		layout: PublicLayout,
		isPublic: true,
	},
];

export default routes;
