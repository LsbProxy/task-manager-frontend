import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { filter, findIndex, trim } from 'lodash';

import { Sprint } from '../common/services/SprintService';
import dashboardService from '../common/services/DashboardService';

interface State {
	loading: boolean;
	sprints: Sprint[];
}

const initialState: State = {
	loading: false,
	sprints: [],
};

export const listSprints = createAsyncThunk('listSprints', async (id: string) =>
	dashboardService.getDashboard(id),
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

		builder.addCase(listSprints.rejected, (state) => {
			state.loading = false;
		});

		builder.addCase(listSprints.fulfilled, (state, action) => {
			state.loading = false;
			state.sprints = action.payload.sprints;
		});
	},
});

export const { updateSprint } = sprintSlice.actions;

export default sprintSlice.reducer;
