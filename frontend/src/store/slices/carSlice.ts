import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICar, IData } from "../../interfaces";
import {API_URI} from "../../API_URI";

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

// Функции для работы с localStorage
const SESSION_KEY = 'car_app_session';

const saveSession = (state: Partial<IDataState>) => {
    try {
        const sessionData = {
            isAuth: state.isAuth,
            data: state.data,
            login: state.login,
            searchCCarBool: state.searchCCarBool,
            searchOCarBool: state.searchOCarBool,
            searchCCars: state.searchCCars,
            searchOCars: state.searchOCars,
            sortOrder: state.sortOrder,
            completedCarsPagination: state.completedCarsPagination,
            operationCarsPagination: state.operationCarsPagination,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
        console.error('Error saving session:', error);
    }
};

const loadSession = (): Partial<IDataState> => {
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        return sessionData ? JSON.parse(sessionData) : {};
    } catch (error) {
        console.error('Error loading session:', error);
        return {};
    }
};

const clearSession = () => {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (error) {
        console.error('Error clearing session:', error);
    }
};

// Загружаем сохраненную сессию при инициализации
const savedSession = loadSession();

const initialState: IDataState = {
    isAuth: savedSession.isAuth ?? true,
    data: savedSession.data ?? null,
    error: null,
    status: null,
    server_message: null,
    login: savedSession.login ?? 'admin',
    password: 'pass', // Не сохраняем пароль в localStorage из соображений безопасности
    searchCCarBool: savedSession.searchCCarBool ?? false,
    searchOCarBool: savedSession.searchOCarBool ?? false,
    searchCCars: savedSession.searchCCars ?? null,
    searchOCars: savedSession.searchOCars ?? null,
    sortOrder: savedSession.sortOrder ?? 'newest',

    // Пагинация для выданных авто
    completedCarsPagination: savedSession.completedCarsPagination ?? {
        currentPage: 1,
        itemsPerPage: 5,
        totalPages: 1,
    },

    // Пагинация для авто в работе
    operationCarsPagination: savedSession.operationCarsPagination ?? {
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

            const response = await fetch(API_URI.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login,
                    password
                }),
            });

            const data = await response.json()

            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Ошибка авторизации');
            }
            // console.log(data)
            return data
        } catch (e: any) {
            console.log('Fetch error:', e);
            return thunkAPI.rejectWithValue('Ошибка соединения с сервером');
        }
    }
);

export const fetchChangePassword = createAsyncThunk(
    'dataSlice/fetchChangePassword',
    async ({ id, old_pass, new_pass}: { id: any; old_pass: string; new_pass: string }, thunkAPI) => {
        try {
            console.log(typeof id)
            const response = await fetch(API_URI.change_pass, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, old_pass, new_pass }),
            });

            const data = await response.json();
            console.log(data)

            if (!response.ok) {
                console.log('!!!!')
                return thunkAPI.rejectWithValue(data.message || 'Не удалось изменить пароль');
            }

            return 'Пароль успешно изменён';
        } catch (error: any) {
            console.log(error)
            return thunkAPI.rejectWithValue(error.message || 'Ошибка соединения с сервером');
        }
    }
);

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        signOut(state) {
            state.isAuth = false;
            state.error = null;
            state.status = null;
            clearSession(); // Очищаем сессию при выходе
        },

        deleteServerMessage(state) {
            state.server_message = null;
            saveSession(state); // Сохраняем состояние
        },

        setServer(state) {
            state.server_message = 'Пароль успешно изменен!';
            saveSession(state); // Сохраняем состояние
        },

        signIn(state) {
            state.isAuth = true;
            saveSession(state); // Сохраняем состояние
        },

        // changePassword(state, action) {
        //     state.password = action.payload;
        //     // Пароль не сохраняем в localStorage из соображений безопасности
        // },

        searchOptionalCars(state, action) {
            state.searchOCarBool = true;
            const searchTerm = action.payload?.toLowerCase() || '';
            state.searchOCars = state.data?.cars?.filter(car =>
                car?.name?.toLowerCase().includes(searchTerm) ||
                car?.auto?.toLowerCase().includes(searchTerm) ||
                car?.VIN?.toLowerCase().includes(searchTerm)
            ) || null;

            state.operationCarsPagination.currentPage = 1;
            saveSession(state); // Сохраняем состояние
        },

        clearSearchOptionalCars(state) {
            state.searchOCars = null;
            state.searchOCarBool = false;
            state.operationCarsPagination.currentPage = 1;
            saveSession(state); // Сохраняем состояние
        },

        searchCompletedCars(state, action) {
            state.searchCCarBool = true;
            const searchTerm = action.payload?.toLowerCase() || '';
            state.searchCCars = state.data?.cars?.filter(car =>
                car?.name?.toLowerCase().includes(searchTerm) ||
                car?.auto?.toLowerCase().includes(searchTerm) ||
                car?.VIN?.toLowerCase().includes(searchTerm)
            ) || null;

            state.completedCarsPagination.currentPage = 1;
            saveSession(state); // Сохраняем состояние
        },

        clearSearchCompletedCars(state) {
            state.searchCCars = null;
            state.searchCCarBool = false;
            state.completedCarsPagination.currentPage = 1;
            saveSession(state); // Сохраняем состояние
        },

        sortCarsByDate(state, action) {
            state.sortOrder = action.payload;

            const carsToSort = state.searchCCarBool ? state.searchCCars :
                state.searchOCarBool ? state.searchOCars :
                    state.data?.cars;

            if (!carsToSort) return;

            const parseDate = (dateString: string | null | undefined): number => {
                if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
                    return -Infinity;
                }

                // Парсим формат DD.MM.YYYY
                const parts = dateString.split('.');
                if (parts.length === 3) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1; // месяцы в JS: 0-11
                    const year = parseInt(parts[2], 10);

                    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                        const date = new Date(year, month, day);
                        if (!isNaN(date.getTime())) {
                            return date.getTime(); // возвращает миллисекунды
                        }
                    }
                }

                return -Infinity; // невалидная дата → в конец
            };

            const sortedCars = [...carsToSort].sort((a, b) => {
                const dateA = parseDate(a.status?.datetime);
                const dateB = parseDate(b.status?.datetime);
                return action.payload === 'newest' ? dateB - dateA : dateA - dateB;
            });

            if (state.searchCCarBool && Array.isArray(state.searchCCars)) {
                state.searchCCars = sortedCars;
            } else if (state.searchOCarBool && Array.isArray(state.searchOCars)) {
                state.searchOCars = sortedCars;
            } else if (state.data?.cars) {
                state.data.cars = sortedCars;
            }

            state.completedCarsPagination.currentPage = 1;
            state.operationCarsPagination.currentPage = 1;
            saveSession(state);
        },
        applyDefaultSort(state) {
            if (!state.data?.cars) return;

            const parseDate = (dateString: string | null | undefined): number => {
                if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
                    return -Infinity;
                }

                const parts = dateString.split('.');
                if (parts.length === 3) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);

                    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                        const date = new Date(year, month, day);
                        if (!isNaN(date.getTime())) {
                            return date.getTime();
                        }
                    }
                }

                return -Infinity;
            };

            const sortedCars = [...state.data.cars].sort((a, b) => {
                const dateA = parseDate(a.status?.datetime);
                const dateB = parseDate(b.status?.datetime);
                return dateB - dateA; // newest
            });

            state.data.cars = sortedCars;
            state.sortOrder = 'newest';
            state.completedCarsPagination.currentPage = 1;
            state.operationCarsPagination.currentPage = 1;
            saveSession(state);
        },
        // Редьюсеры для пагинации
        setCompletedCarsCurrentPage(state, action: { payload: number }) {
            const totalPages = Math.ceil(
                (state.searchCCarBool ? state.searchCCars?.length || 0 :
                    state.data?.cars?.filter(car => car.status.level === 6).length || 0) /
                state.completedCarsPagination.itemsPerPage
            );

            if (action.payload >= 1 && action.payload <= totalPages) {
                state.completedCarsPagination.currentPage = action.payload;
                saveSession(state); // Сохраняем состояние
            }
        },

        setCompletedCarsItemsPerPage(state, action: { payload: number }) {
            state.completedCarsPagination.itemsPerPage = action.payload;
            state.completedCarsPagination.currentPage = 1;

            const totalCompletedCars = state.searchCCarBool ?
                state.searchCCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level === 6).length || 0;

            state.completedCarsPagination.totalPages = Math.ceil(
                totalCompletedCars / action.payload
            );
            saveSession(state); // Сохраняем состояние
        },

        setOperationCarsCurrentPage(state, action: { payload: number }) {
            const totalPages = Math.ceil(
                (state.searchOCarBool ? state.searchOCars?.length || 0 :
                    state.data?.cars?.filter(car => car.status.level !== 6).length || 0) /
                state.operationCarsPagination.itemsPerPage
            );

            if (action.payload >= 1 && action.payload <= totalPages) {
                state.operationCarsPagination.currentPage = action.payload;
                saveSession(state); // Сохраняем состояние
            }
        },

        setOperationCarsItemsPerPage(state, action: { payload: number }) {
            state.operationCarsPagination.itemsPerPage = action.payload;
            state.operationCarsPagination.currentPage = 1;

            const totalOperationCars = state.searchOCarBool ?
                state.searchOCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level !== 6).length || 0;

            state.operationCarsPagination.totalPages = Math.ceil(
                totalOperationCars / action.payload
            );
            saveSession(state); // Сохраняем состояние
        },

        updateCompletedCarsTotalPages(state) {
            const totalCompletedCars = state.searchCCarBool ?
                state.searchCCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level === 6).length || 0;

            state.completedCarsPagination.totalPages = Math.ceil(
                totalCompletedCars / state.completedCarsPagination.itemsPerPage
            );

            if (state.completedCarsPagination.currentPage > state.completedCarsPagination.totalPages) {
                state.completedCarsPagination.currentPage = Math.max(1, state.completedCarsPagination.totalPages);
            }
            saveSession(state); // Сохраняем состояние
        },

        updateOperationCarsTotalPages(state) {
            const totalOperationCars = state.searchOCarBool ?
                state.searchOCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level !== 6).length || 0;

            state.operationCarsPagination.totalPages = Math.ceil(
                totalOperationCars / state.operationCarsPagination.itemsPerPage
            );

            if (state.operationCarsPagination.currentPage > state.operationCarsPagination.totalPages) {
                state.operationCarsPagination.currentPage = Math.max(1, state.operationCarsPagination.totalPages);
            }
            saveSession(state); // Сохраняем состояние
        },

        updateAllPagination(state) {
            const totalCompletedCars = state.searchCCarBool ?
                state.searchCCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level === 6).length || 0;

            state.completedCarsPagination.totalPages = Math.ceil(
                totalCompletedCars / state.completedCarsPagination.itemsPerPage
            );

            const totalOperationCars = state.searchOCarBool ?
                state.searchOCars?.length || 0 :
                state.data?.cars?.filter(car => car.status.level !== 6).length || 0;

            state.operationCarsPagination.totalPages = Math.ceil(
                totalOperationCars / state.operationCarsPagination.itemsPerPage
            );

            if (state.completedCarsPagination.currentPage > state.completedCarsPagination.totalPages) {
                state.completedCarsPagination.currentPage = Math.max(1, state.completedCarsPagination.totalPages);
            }

            if (state.operationCarsPagination.currentPage > state.operationCarsPagination.totalPages) {
                state.operationCarsPagination.currentPage = Math.max(1, state.operationCarsPagination.totalPages);
            }
            saveSession(state); // Сохраняем состояние
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSignIn.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload;
                state.isAuth = true;

                state.completedCarsPagination.currentPage = 1;
                state.operationCarsPagination.currentPage = 1;

                const totalCompletedCars = action.payload?.cars?.filter((car:ICar) => car.status.level === 6).length || 0;
                const totalOperationCars = action.payload?.cars?.filter((car:ICar) => car.status.level !== 6).length || 0;

                state.completedCarsPagination.totalPages = Math.ceil(
                    totalCompletedCars / state.completedCarsPagination.itemsPerPage
                );

                state.operationCarsPagination.totalPages = Math.ceil(
                    totalOperationCars / state.operationCarsPagination.itemsPerPage
                );

                saveSession(state); // Сохраняем состояние после успешного входа
            })

            .addCase(fetchSignIn.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSignIn.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuth = false;
                state.error = action.payload as string || 'Произошла ошибка! Попробуйте снова.';
                clearSession(); // Очищаем сессию при ошибке входа
            })
            .addCase(fetchChangePassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                // ❌ УБИРАЕМ state.isAuth = true; - не меняем статус авторизации
                state.server_message = action.payload as string || 'Пароль успешно изменен.';
                saveSession(state);
            })
            .addCase(fetchChangePassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChangePassword.rejected, (state, action) => {
                state.status = 'failed';
                // ❌ УБИРАЕМ state.isAuth = false; - не выходим из системы при ошибке смены пароля
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