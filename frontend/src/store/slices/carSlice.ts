import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICar, IData } from "../../interfaces";

export interface IDataState {
    isAuth: boolean;
    data: IData | null;
    error: string | null;
    status: 'loading' | 'succeeded' | 'failed' | null;
    server_message: string | null;
    login: string;
    password: string;
    searchCCarBool: boolean;
    searchOCarBool: boolean;
    searchCCars: ICar[] | null;
    searchOCars: ICar[] | null;
    sortOrder: 'newest' | 'oldest';

    // Раздельная пагинация для двух списков
    completedCarsPagination: {
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
    };
    operationCarsPagination: {
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
    };
}

const initialState: IDataState = {
    isAuth: true,
    data: null,
    error: null,
    status: null,
    server_message: null,
    login: 'admin',
    password: 'pass',
    searchCCarBool: false,
    searchOCarBool: false,
    searchCCars: null,
    searchOCars: null,
    sortOrder: 'newest',

    // Пагинация для выданных авто
    completedCarsPagination: {
        currentPage: 1,
        itemsPerPage: 5,
        totalPages: 1,
    },

    // Пагинация для авто в работе
    operationCarsPagination: {
        currentPage: 1,
        itemsPerPage: 5,
        totalPages: 1,
    },
};
export const fetchSignIn = createAsyncThunk(
    'dataSlice/fetchSignIn',
    async ({ login, password }: { login: string, password: string }, thunkAPI) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login,
                    password
                }),
            });
            // console.log(response)

            const data = await response.json()

            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Ошибка авторизации');
            }
            return data
        } catch (e: any) {
            console.log('Fetch error:', e);
            return thunkAPI.rejectWithValue('Ошибка соединения с сервером');
        }
    }
);

export const fetchChangePassword = createAsyncThunk(
    'dataSlice/fetchChangePassword',
    async ({ oldPassword, newPassword, login }: { oldPassword: string, newPassword: string, login: string }, thunkAPI) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

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
            });

            const data = await response.json();
            if (!response.ok || data.status_code !== 200) {
                return thunkAPI.rejectWithValue('Не удалось поменять пароль.');
            } else {
                return thunkAPI.fulfillWithValue('Пароль успешно изменен.');
            }

        } catch (e: any) {
            return thunkAPI.rejectWithValue('Ошибка авторизации.');
        }
    }
);

// export const fetchGetPhotosCar = createAsyncThunk(
//     'dataSlice/fetchGetPhotosCar',
//     async ({carId, parentId} : {carId: string | number, parentId: string | number}, thunkAPI) => {
//         try {
//             await new Promise(resolve => setTimeout(resolve, 1000));
//
//             const response = await fetch(`http://localhost:5000/api/load-photos/${parentId}/${carId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const photosData = await response.json()
//
//             if (!response.ok || photosData.status_code !== 200) {
//                 return thunkAPI.rejectWithValue('Не удалось получить фотографии');
//             } else {
//                 return photosData
//             }
//
//         } catch (e: any) {
//             return thunkAPI.rejectWithValue('Не удалось получить фотографии')
//         }
//
//     }
// )

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        signOut(state) {
            state.isAuth = false;
            state.error = null;
            state.status = null;
        },

        deleteServerMessage(state) {
            state.server_message = null;
        },

        setServer(state) {
            state.server_message = 'Пароль успешно изменен!';
        },

        signIn(state) {
            state.isAuth = true;
        },

        changePassword(state, action) {
            state.password = action.payload;
        },

        searchOptionalCars(state, action) {
            state.searchOCarBool = true;
            const searchTerm = action.payload?.toLowerCase() || '';
            state.searchOCars = state.data?.cars?.filter(car =>
                car.name.toLowerCase().includes(searchTerm) ||
                car.auto.toLowerCase().includes(searchTerm) ||
                car.VIN.toLowerCase().includes(searchTerm)
            ) || null;
            // Сброс пагинации для авто в работе при поиске
            state.operationCarsPagination.currentPage = 1;
        },

        clearSearchOptionalCars(state) {
            state.searchOCars = null;
            state.searchOCarBool = false;
            // Сброс пагинации для авто в работе
            state.operationCarsPagination.currentPage = 1;
        },

        searchCompletedCars(state, action) {
            state.searchCCarBool = true;
            const searchTerm = action.payload?.toLowerCase() || '';
            state.searchCCars = state.data?.cars?.filter(car =>
                car.name.toLowerCase().includes(searchTerm) ||
                car.auto.toLowerCase().includes(searchTerm) ||
                car.VIN.toLowerCase().includes(searchTerm)
            ) || null;
            // Сброс пагинации для выданных авто при поиске
            state.completedCarsPagination.currentPage = 1;
        },

        clearSearchCompletedCars(state) {
            state.searchCCars = null;
            state.searchCCarBool = false;
            // Сброс пагинации для выданных авто
            state.completedCarsPagination.currentPage = 1;
        },

        sortCarsByDate(state, action: { payload: 'newest' | 'oldest' }) {
            state.sortOrder = action.payload;

            const carsToSort = state.searchCCarBool ? state.searchCCars :
                state.searchOCarBool ? state.searchOCars :
                    state.data?.cars;

            if (!carsToSort) return;

            const sortedCars = [...carsToSort].sort((a, b) => {
                const dateA = new Date(a.status.datetime).getTime();
                const dateB = new Date(b.status.datetime).getTime();

                return action.payload === 'newest' ? dateB - dateA : dateA - dateB;
            });

            if (state.searchCCarBool) {
                state.searchCCars = sortedCars;
            } else if (state.searchOCarBool) {
                state.searchOCars = sortedCars;
            } else if (state.data) {
                state.data.cars = sortedCars;
            }

            // Сброс пагинации после сортировки
            state.completedCarsPagination.currentPage = 1;
            state.operationCarsPagination.currentPage = 1;
        },

        applyDefaultSort(state) {
            if (!state.data?.cars) return;

            const sortedCars = [...state.data.cars].sort((a, b) => {
                const dateA = new Date(a.status.datetime).getTime();
                const dateB = new Date(b.status.datetime).getTime();
                return dateB - dateA;
            });

            state.data.cars = sortedCars;

            // Сброс пагинации после применения сортировки по умолчанию
            state.completedCarsPagination.currentPage = 1;
            state.operationCarsPagination.currentPage = 1;
        },

        // Редьюсеры для пагинации выданных авто
        setCompletedCarsCurrentPage(state, action: { payload: number }) {
            const totalPages = Math.ceil(
                (state.searchCCarBool ? state.searchCCars?.length || 0 :
                    state.data?.cars?.filter(car => car.status.level === 6).length || 0) /
                state.completedCarsPagination.itemsPerPage
            );

            if (action.payload >= 1 && action.payload <= totalPages) {
                state.completedCarsPagination.currentPage = action.payload;
            }
        },

        setCompletedCarsItemsPerPage(state, action: { payload: number }) {
            state.completedCarsPagination.itemsPerPage = action.payload;
            state.completedCarsPagination.currentPage = 1;

            // Пересчет totalPages
            const totalCompletedCars = state.searchCCarBool ?
                state.searchCCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level === 6).length || 0;

            state.completedCarsPagination.totalPages = Math.ceil(
                totalCompletedCars / action.payload
            );
        },

        updateCompletedCarsTotalPages(state) {
            const totalCompletedCars = state.searchCCarBool ?
                state.searchCCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level === 6).length || 0;

            state.completedCarsPagination.totalPages = Math.ceil(
                totalCompletedCars / state.completedCarsPagination.itemsPerPage
            );

            // Корректировка currentPage если он превышает totalPages
            if (state.completedCarsPagination.currentPage > state.completedCarsPagination.totalPages) {
                state.completedCarsPagination.currentPage = Math.max(1, state.completedCarsPagination.totalPages);
            }
        },

        // Редьюсеры для пагинации авто в работе
        setOperationCarsCurrentPage(state, action: { payload: number }) {
            const totalPages = Math.ceil(
                (state.searchOCarBool ? state.searchOCars?.length || 0 :
                    state.data?.cars?.filter(car => car.status.level !== 6).length || 0) /
                state.operationCarsPagination.itemsPerPage
            );

            if (action.payload >= 1 && action.payload <= totalPages) {
                state.operationCarsPagination.currentPage = action.payload;
            }
        },

        setOperationCarsItemsPerPage(state, action: { payload: number }) {
            state.operationCarsPagination.itemsPerPage = action.payload;
            state.operationCarsPagination.currentPage = 1;

            // Пересчет totalPages
            const totalOperationCars = state.searchOCarBool ?
                state.searchOCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level !== 6).length || 0;

            state.operationCarsPagination.totalPages = Math.ceil(
                totalOperationCars / action.payload
            );
        },

        updateOperationCarsTotalPages(state) {
            const totalOperationCars = state.searchOCarBool ?
                state.searchOCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level !== 6).length || 0;

            state.operationCarsPagination.totalPages = Math.ceil(
                totalOperationCars / state.operationCarsPagination.itemsPerPage
            );

            // Корректировка currentPage если он превышает totalPages
            if (state.operationCarsPagination.currentPage > state.operationCarsPagination.totalPages) {
                state.operationCarsPagination.currentPage = Math.max(1, state.operationCarsPagination.totalPages);
            }
        },

        // Общий редьюсер для обновления всех totalPages
        updateAllPagination(state) {
            // Для выданных авто
            const totalCompletedCars = state.searchCCarBool ?
                state.searchCCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level === 6).length || 0;

            state.completedCarsPagination.totalPages = Math.ceil(
                totalCompletedCars / state.completedCarsPagination.itemsPerPage
            );

            // Для авто в работе
            const totalOperationCars = state.searchOCarBool ?
                state.searchOCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level !== 6).length || 0;

            state.operationCarsPagination.totalPages = Math.ceil(
                totalOperationCars / state.operationCarsPagination.itemsPerPage
            );

            // Корректировка currentPage для обоих списков
            if (state.completedCarsPagination.currentPage > state.completedCarsPagination.totalPages) {
                state.completedCarsPagination.currentPage = Math.max(1, state.completedCarsPagination.totalPages);
            }

            if (state.operationCarsPagination.currentPage > state.operationCarsPagination.totalPages) {
                state.operationCarsPagination.currentPage = Math.max(1, state.operationCarsPagination.totalPages);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSignIn.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload;
                state.isAuth = true;
                console.log(action.payload)

                // Обновление пагинации после загрузки данных
                state.completedCarsPagination.currentPage = 1;
                state.operationCarsPagination.currentPage = 1;

                // Пересчет totalPages
                const totalCompletedCars = action.payload?.cars?.filter((car:ICar) => car.status.level === 6).length || 0;
                const totalOperationCars = action.payload?.cars?.filter((car:ICar) => car.status.level !== 6).length || 0;

                state.completedCarsPagination.totalPages = Math.ceil(
                    totalCompletedCars / state.completedCarsPagination.itemsPerPage
                );

                state.operationCarsPagination.totalPages = Math.ceil(
                    totalOperationCars / state.operationCarsPagination.itemsPerPage
                );
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
                state.server_message = action.payload as string || 'Пароль успешно изменен.';
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
});

export const {
    signOut,
    deleteServerMessage,
    setServer,
    signIn,
    searchOptionalCars,
    clearSearchOptionalCars,
    clearSearchCompletedCars,
    searchCompletedCars,
    changePassword,
    sortCarsByDate,
    applyDefaultSort,
    setCompletedCarsCurrentPage,
    setCompletedCarsItemsPerPage,
    setOperationCarsCurrentPage,
    setOperationCarsItemsPerPage,
    updateCompletedCarsTotalPages,
    updateOperationCarsTotalPages,
    updateAllPagination
} = dataSlice.actions;

export default dataSlice.reducer;