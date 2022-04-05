import authService, { User } from '../common/services/AuthService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface State {
	loading: boolean;
	users: User[];
}

const initialState: State = {
	loading: false,
	users: [],
};

export const getUsers = createAsyncThunk('getUsers', async () => authService.getUsers());

export const UserSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getUsers.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getUsers.rejected, (state) => {
			state.loading = false;
		});

		builder.addCase(getUsers.fulfilled, (state, action) => {
			state.loading = false;
			state.users = action.payload;
		});
	},
});

export default UserSlice.reducer;
