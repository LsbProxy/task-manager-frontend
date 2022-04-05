import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { filter, findIndex, trim } from 'lodash';
import sprintService, { Sprint } from '../common/services/SprintService';

import { Task } from '../common/services/TaskService';

interface State {
	loading: boolean;
	sprint: Sprint;
}

const initialState: State = {
	loading: false,
	sprint: {
		id: '',
		title: '',
		description: '',
		createdDate: '',
		updatedDate: '',
		endDate: '',
		dashboard: '',
		tasks: [],
	},
};

export const listTasks = createAsyncThunk('listTasks', async (id: string) =>
	sprintService.getSprint(id),
);

export const taskSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		updateTask: (
			state,
			{
				payload: { task, removeFromGrid },
			}: PayloadAction<{ task: Task; removeFromGrid?: boolean }>,
		) => {
			if (!task) {
				return;
			}

			const newSprint = { ...state.sprint };

			if (removeFromGrid) {
				newSprint.tasks = filter(state.sprint.tasks, ({ id }: Task) => id !== task.id);
			} else {
				const taskIndex = findIndex(state.sprint.tasks, ({ id }: Task) => id === task.id);
				const updatedTask = task;

				if (taskIndex === -1) {
					return;
				}

				if (!trim(updatedTask.title)) {
					updatedTask.title = state.sprint.tasks[taskIndex].title;
				}

				newSprint.tasks[taskIndex] = updatedTask;
			}

			state.sprint = newSprint;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(listTasks.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(listTasks.rejected, (state) => {
			state.loading = false;
		});

		builder.addCase(listTasks.fulfilled, (state, action) => {
			state.loading = false;
			state.sprint = action.payload;
		});
	},
});

export const { updateTask } = taskSlice.actions;

export default taskSlice.reducer;
