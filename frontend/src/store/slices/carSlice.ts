import {ICar, IData} from "../../interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "@reduxjs/toolkit/query";

export interface IDataState {
    isAuth: boolean
    data: IData | null
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    server_message: string | null,
    login: string, //d
    password: string //d
    searchCCarBool: boolean
    searchOCarBool: boolean
    searchCCars: ICar[] | null
    searchOCars: ICar[] | null
}

const initialState: IDataState = {
    isAuth: true,
    data: {
        user: {name: 'Иванов Иван Иванович'},
        manager: {
            name: 'Петров Пётр Петрович',
            number: '89144034586'
        },
        cars: [
            {
                name: "Ваня",
                VIN: "5YJSA1E14GF123456",
                auto: "Tesla",
                year: "2023",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 6,
                    description: "Авто выдан",
                    datetime: "2024-04-01T09:15:30"
                }
            },
            {
                name: "Паша",
                VIN: "5UXCR6C5XJ9A12345",
                auto: "BMW",
                year: "2022",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 6,
                    description: "Авто выдан",
                    datetime: "2024-04-03T14:22:10"
                }
            },
            {
                name: "Глаша A6",
                VIN: "WAUAFDF58HN012345",
                auto: "Audi",
                year: "2021",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 1,
                    description: "На оплате/на заводе",
                    datetime: "2024-04-05T11:45:00"
                }
            },
            {
                name: "Сергей Антононович",
                VIN: "WDDWF8KB0ER123456",
                auto: "Mercedes",
                year: "2020",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 2,
                    description: "На стоянке в Китае",
                    datetime: "2024-04-06T16:30:45"
                }
            },
            {
                name: "Ирина Валерьевна",
                VIN: "1ZVBP8EM9J5123456",
                auto: "Ford",
                year: "2019",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 1,
                    description: "На оплате/на заводе",
                    datetime: "2024-04-07T08:10:20"
                }
            },
            {
                name: "Лена Пахомова",
                VIN: "4T1BF1FKXEU123456",
                auto: "Toyota",
                year: "2023",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 4,
                    description: "На СВХ",
                    datetime: "2024-04-09T13:55:15"
                }
            },
            {
                name: "Ричард ДЖеннисон",
                VIN: "1HGCP2F9XLA123456",
                auto: "Honda",
                year: "2022",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 3,
                    description: "Доставка в РФ",
                    datetime: "2024-04-11T17:05:33"
                }
            },
            {
                name: "Марина Ибрагимова",
                VIN: "WP0AB2A98HS789012",
                auto: "Porsche",
                year: "2024",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 1,
                    description: "На оплате/на заводе",
                    datetime: "2024-04-13T10:40:12"
                }
            },
            {
                name: "Николай Соболев",
                VIN: "2T2BZMCA1JC123456",
                auto: "Lexus",
                year: "2021",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 2,
                    description: "На стоянке в Китае",
                    datetime: "2024-04-15T12:25:50"
                }
            },
            {
                name: "Наталья Гуменюк",
                VIN: "YV1A22MKXJ2123456",
                auto: "Volvo",
                year: "2020",
                photos: ['photos_1.jpg', 'photos_2.jpg'],
                status: {
                    level: 6,
                    description: "Авто выдан",
                    datetime: "2024-04-17T18:00:00"
                }
            }
        ]
    },
    error: null,
    status: null,
    server_message: null,
    login: 'admin', //d
    password: 'pass', //d
    searchCCarBool: false,
    searchOCarBool: false,
    searchCCars: null,
    searchOCars: null
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
            return thunkAPI.rejectWithValue('Ошибка авторизации.')
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
            return thunkAPI.rejectWithValue('Ошибка авторизации.')
        }
    }
)

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers : {
        signOut(state) {
            // state.data = null;
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
        },
        signIn(state) {
            state.isAuth = true
        },
        searchOptionalCars(state, action) {
            state.searchOCarBool = true
            const searchTerm = action.payload?.toLowerCase() || '';
            state.searchOCars = state.data?.cars?.filter(car =>
                car.name.toLowerCase().includes(searchTerm) || car.auto.toLowerCase().includes(searchTerm)
            ) || null;
        },
        clearSearchOptionalCars(state) {
            state.searchOCars = null
            state.searchOCarBool = false
        },
        searchCompletedCars(state, action) {
            state.searchCCarBool = true
            const searchTerm = action.payload?.toLowerCase() || '';
            state.searchCCars = state.data?.cars?.filter(car =>
                car.name.toLowerCase().includes(searchTerm) || car.auto.toLowerCase().includes(searchTerm)
            ) || null;
        },
        clearSearchCompletedCars(state) {
            state.searchCCars = null
            state.searchCCarBool = false
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

export const { signOut, deleteServerMessage, setServer,
    signIn, searchOptionalCars, clearSearchOptionalCars,
    clearSearchCompletedCars, searchCompletedCars,
} = dataSlice.actions;

export default dataSlice.reducer;
