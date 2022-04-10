import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { filter, findIndex, trim } from 'lodash';

import { Error } from '../common/context/NotificationContextProvider';
import { Sprint } from '../common/services/SprintService';
import dashboardService from '../common/services/DashboardService';

interface State {
	loading: boolean;
	error?: Error;
	sprints: Sprint[];
}

const initialState: State = {
	loading: false,
	sprints: [],
};

export const listSprints = createAsyncThunk('listSprints', async (id: string) =>
	dashboardService.getDashboard(id).catch((e) => {
		if (e.error && e.error[0]) {
			throw e.error[0];
		}
		throw e;
	}),
);

export const sprintSlice = createSlice({
	name: 'sprints',
	initialState,
	reducers: {
		updateSprint: (
			state,
			{
				payload: { sprint, removeFromGrid },
			}: PayloadAction<{ sprint: Sprint; removeFromGrid?: boolean }>,
		) => {
			let newSprints: Sprint[] = [...state.sprints];

			if (removeFromGrid) {
				newSprints = filter(state.sprints, ({ id }: Sprint) => id !== sprint.id);
			} else {
				const index = findIndex(state.sprints, ({ id }: Sprint) => id === sprint.id);
				const updatedSprint = sprint;

				if (!trim(updatedSprint.title)) {
					updatedSprint.title = state.sprints[index].title;
				}

				newSprints[index] = updatedSprint;
			}

			state.sprints = newSprints;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(listSprints.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(listSprints.rejected, (state, { error }) => {
			state.loading = false;
			state.error = error as Error;
		});

		builder.addCase(listSprints.fulfilled, (state, action) => {
			state.loading = false;
			state.sprints = action.payload.sprints;
		});
	},
});

export const { updateSprint } = sprintSlice.actions;

export default sprintSlice.reducer;
