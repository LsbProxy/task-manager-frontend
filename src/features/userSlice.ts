import authService, { User } from '../common/services/AuthService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Error } from '../common/context/NotificationContextProvider';

interface State {
	loading: boolean;
	error?: Error;
	users: User[];
}

const initialState: State = {
	loading: false,
	users: [],
};

export const getUsers = createAsyncThunk('getUsers', async () =>
	authService.getUsers().catch((e) => {
		if (e.error && e.error[0]) {
			throw e.error[0];
		}
		throw e;
	}),
);

export const UserSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getUsers.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getUsers.rejected, (state, { error }) => {
			state.loading = false;
			state.error = error as Error;
		});

		builder.addCase(getUsers.fulfilled, (state, action) => {
			state.loading = false;
			state.users = action.payload;
		});
	},
});

export default UserSlice.reducer;
