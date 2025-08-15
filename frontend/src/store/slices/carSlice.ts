import {ICar, IData} from "../../interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "@reduxjs/toolkit/query";

export interface IDataState {
    isAuth: boolean
    data: IData | null
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    server_message: string | null
}

const initialState: IDataState = {
    isAuth: true,
    data: null,
    error: null,
    status: null,
    server_message: null

};

export const fetchSignIn = createAsyncThunk(
    'dataSlice/fetchSignIn',
    async ({login, password}: {login: string, password: string}, thunkAPI) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login,
                    password
                }),
            })

            const data = await response.json()
            if (!response.ok || data.status_code !== 200) {
                return thunkAPI.rejectWithValue('Ошибка авторизации.')
            }

            // localStorage.setItem('carName', name);
            // localStorage.setItem('carVIN', VIN);

            return data.data
        } catch (e:any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchChangePassword = createAsyncThunk(
    'dataSlice/fetchChangePassword',
    async ({oldPassword, newPassword, login}: {oldPassword: string, newPassword: string, login: string}, thunkAPI) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const response = await fetch('/api/change-pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login,
                    oldPassword,
                    newPassword
                }),
            })

            const data = await response.json()
            if (!response.ok || data.status_code !== 200) {
                return thunkAPI.rejectWithValue('Ну удалось поменять пароль.')
            } else {
                thunkAPI.fulfillWithValue('Пароль успешно изменен.')
            }

        } catch (e:any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers : {
        signOut(state) {
            state.data = null;
            state.isAuth = false;
            state.error = null;
            state.status = null;
            // localStorage.removeItem('carState');
            // localStorage.removeItem('carName');
            // localStorage.removeItem('carVIN');
        },
        deleteServerMessage(state) {
            state.server_message = null
        },
        setServer(state) {
            state.server_message = 'Пароль успешно изменен!'
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSignIn.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload;
                state.isAuth = true;
            })
            .addCase(fetchSignIn.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSignIn.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuth = false;
                state.error = action.payload as string || 'Произошла ошибка! Попробуйте снова.';
            })
            .addCase(fetchChangePassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isAuth = true;
                if (action.payload) {
                    state.server_message = action.payload;
                } else {
                    state.server_message = 'Пароль успешно изменен.';
                }
            })
            .addCase(fetchChangePassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChangePassword.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuth = false;
                state.error = action.payload as string || 'Произошла ошибка! Попробуйте снова.';
            });

    }
})

export const { signOut, deleteServerMessage, setServer } = dataSlice.actions;

export default dataSlice.reducer;
