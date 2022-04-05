import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboardSlice';
import sprintReducer from '../features/sprintSlice';
import taskReducer from '../features/taskSlice';
import userReducer from '../features/userSlice';

export const store = configureStore({
	reducer: {
		users: userReducer,
		dashboards: dashboardReducer,
		sprints: sprintReducer,
		tasks: taskReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
