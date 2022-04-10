import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dashboardService, { Dashboard } from '../common/services/DashboardService';
import { filter, findIndex, trim } from 'lodash';

import { Error } from '../common/context/NotificationContextProvider';

interface State {
	loading: boolean;
	error?: Error;
	dashboards: Dashboard[];
}

const initialState: State = {
	loading: false,
	dashboards: [],
};

export const listDashboards = createAsyncThunk('listDashboards', async () =>
	dashboardService.listDashboards().catch((e) => {
		if (e.error && e.error[0]) {
			throw e.error[0];
		}
		throw e;
	}),
);

export const dashboardSlice = createSlice({
	name: 'dashboards',
	initialState,
	reducers: {
		updateDashboard: (
			state,
			{
				payload: { dashboard, removeFromGrid },
			}: PayloadAction<{ dashboard: Dashboard; removeFromGrid?: boolean }>,
		) => {
			let newDashboards = [...state.dashboards];

			if (removeFromGrid) {
				newDashboards = filter(state.dashboards, ({ id }: Dashboard) => id !== dashboard.id);
			} else {
				const index = findIndex(state.dashboards, ({ id }: Dashboard) => id === dashboard.id);
				const updatedDashboard = dashboard;

				if (!trim(updatedDashboard.title)) {
					updatedDashboard.title = state.dashboards[index].title;
				}

				newDashboards[index] = updatedDashboard;
			}

			state.dashboards = newDashboards;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(listDashboards.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(listDashboards.rejected, (state, { error }) => {
			state.loading = false;
			state.error = error as Error;
		});

		builder.addCase(listDashboards.fulfilled, (state, action) => {
			state.loading = false;
			state.dashboards = action.payload;
		});
	},
});

export const { updateDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
