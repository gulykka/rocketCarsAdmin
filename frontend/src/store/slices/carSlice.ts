import {IData} from "../../interfaces";
import {createSlice} from "@reduxjs/toolkit";

export interface IDataState {
    isAuth: boolean
    data: IData | null
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
}

const initialState: IDataState = {
    isAuth: false,
    data: null,
    error: null,
    status: null,
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers : {

    }
})

export default dataSlice.reducer;
