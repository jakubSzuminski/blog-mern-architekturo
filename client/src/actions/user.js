import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import * as api from '../api';

import { 
    USER_START_LOADING, USER_END_LOADING,
    GET_USER_DATA, 
    LOGIN, LOGIN_FAILED, LOGOUT, 
    ADD_TO_NEWSLETTER,
    REGISTRATION_SUCCESS, REGISTRATION_FAILED,
    ADMIN_SUCCESS, ADMIN_FAILED
} from '../constants/actionTypes';

export const getUserData = () => dispatch => {
    const token = Cookies.get('token') || null;

    if(token) { 
        dispatch({
            type: GET_USER_DATA,
            payload: jwt_decode(token)
        })
    } else dispatch({ type: LOGOUT });
}

export const login = (email, pswd) => async dispatch => {
    dispatch({ type: USER_START_LOADING });

    try {
        const { data } = await api.login(email, pswd);
        const decoded = jwt_decode(data);

        Cookies.set('token', data);

        dispatch({
            type: LOGIN,
            payload: decoded
        });
    } catch (e) {
        dispatch({
            type: LOGIN_FAILED,
            payload: e?.response?.data || 'Błąd serwera.'
        });
    }

    dispatch({ type: USER_END_LOADING });
}

export const register = (nickname, email, pswd, pswd2) => async dispatch => {
    dispatch({ type: USER_START_LOADING });

    try {
        await api.register(nickname, email, pswd, pswd2);
        
        dispatch({
            type: REGISTRATION_SUCCESS
        });
    }
    catch(e) {
        dispatch({
            type: REGISTRATION_FAILED,
            payload: e?.response?.data?.message || 'Nie można zarejestrować. Spróbuj ponownie później'
        });
    }

    dispatch({ type: USER_END_LOADING });
}
    
export const logout = () => dispatch => {
    Cookies.remove('token');
    dispatch({ type: LOGOUT });
}

export const addToNewsletter = (email) => async dispatch => {
    try {
        await api.addToNewsletter(email);
        dispatch({ type: ADD_TO_NEWSLETTER });
    } 
    catch(e) {
        console.log(e.message);
    }
}

export const adminAuth = () => async dispatch => {
    dispatch({ type: USER_START_LOADING });

    try {
        await api.adminAuth();
        dispatch({ type: ADMIN_SUCCESS });
    }
    catch(e) {
        console.log(e);
        dispatch({ type: ADMIN_FAILED });
    }

    dispatch({ type: USER_END_LOADING });
}