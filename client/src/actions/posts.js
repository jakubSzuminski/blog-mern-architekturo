import Cookies from 'js-cookie';
import * as api from '../api';

import { logout } from './user';

import {
    POSTS_START_LOADING, POSTS_END_LOADING, 
    GET_POSTS, GET_POST, GET_NUMBER_OF_POSTS, 
    ADD_COMMENT_START, ADD_COMMENT_END, ADD_COMMENT_FAILED,
    DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILED,
    CREATE_POST_SUCCESS, CREATE_POST_FAILED, 
    EDIT_POST_SUCCESS, EDIT_POST_FAILED,
    DELETE_POST_SUCCESS, DELETE_POST_FAILED,
    CLEAR_SUCCESS, CLEAR_MESSAGE,
} from '../constants/actionTypes';

export const getPosts = (search='', tags=[], limit=1) => async dispatch => {
    dispatch({ type: POSTS_START_LOADING });

    try {
        const { data } = await api.getPosts(search, tags, limit);
        dispatch({ type: GET_POSTS, payload: data });
    }
    catch(e) {
        console.log(e);
    }

    dispatch({ type: POSTS_END_LOADING });
}

export const getPost = (slug) => async dispatch => {
    dispatch({ type: POSTS_START_LOADING });

    try {
        const { data } = await api.getPost(slug);
        dispatch({ type: GET_POST, payload: data });
    }
    catch(e) {
        console.log(e);
    }

    dispatch({ type: POSTS_END_LOADING });
}

export const getNumberOfPosts = () => async dispatch => {
    try {
        const { data } = await api.getNumberOfPosts();
        dispatch({ type: GET_NUMBER_OF_POSTS, payload: data });
    }
    catch(e) {
        console.log(e);
    }
}

export const addComment = (slug, comment) => async dispatch => {
    dispatch({ type: ADD_COMMENT_START });
    
    try {
        const token = Cookies.get('token');
        const jwtExpires = JSON.parse(atob(token.split('.')[1]));
        if(jwtExpires.exp * 1000 < Date.now()) {
            dispatch(logout());
            return;
        }
    }
    catch(e) {
        console.log(e);
    }

    try {
        await api.addComment(slug, comment);
    }
    catch(e) {
        console.log(e);
        dispatch({ type: ADD_COMMENT_FAILED, payload: e?.response?.data || 'Nie mogliśmy dodać komentarza. Spróbuj ponownie później.' });
    }

    dispatch({ type: ADD_COMMENT_END });
}

export const deleteComment = (postID, commentID) => async dispatch => {
    try {
        const token = Cookies.get('token');
        const jwtExpires = JSON.parse(atob(token.split('.')[1]));
        if(jwtExpires.exp * 1000 < Date.now()) {
            dispatch(logout());
            return;
        }
    }
    catch(e) {
        console.log(e);
    }

    try {
        await api.deleteComment(postID, commentID);
        dispatch({ type: DELETE_COMMENT_SUCCESS });
    }
    catch(e) {
        console.log(e);
        dispatch({ type: DELETE_COMMENT_FAILED });
    }
}

export const createPost = (post) => async dispatch => {
    dispatch({ type: POSTS_START_LOADING });

    try { 
        const { data } = await api.createPost(post);
        dispatch({ type: CREATE_POST_SUCCESS, payload: data });
    }
    catch(e) {
        console.log(e);
        dispatch({ type: CREATE_POST_FAILED, payload: e.response.data });
    }

    dispatch({ type: POSTS_END_LOADING });
}

export const editPost = (post) => async dispatch => {
    dispatch({ type: POSTS_START_LOADING });

    try {
        const { data } = await api.editPost(post);
        dispatch({ type: EDIT_POST_SUCCESS, payload: data });
    }
    catch(e) {
        console.log(e);
        dispatch({ type: EDIT_POST_FAILED, payload: e.response.data });
    }

    dispatch({ type: POSTS_END_LOADING });
}

export const deletePost = (postID) => async dispatch => {
    dispatch({ type: POSTS_START_LOADING });

    try {
        const { data } = await api.deletePost(postID);
        dispatch({ type: DELETE_POST_SUCCESS, payload: data });
    }
    catch(e) {
        console.log(e);
        dispatch({ type: DELETE_POST_FAILED, payload: e?.response?.data || 'Nie udało się usunąć posta. Spróbuj ponownie później' });
    }

    dispatch({ type: POSTS_END_LOADING });
}

export const clearSuccess = () => async dispatch => {
    dispatch({ type: CLEAR_SUCCESS });
}

export const clearMessage = () => async dispatch => {
    dispatch({ type: CLEAR_MESSAGE });
}