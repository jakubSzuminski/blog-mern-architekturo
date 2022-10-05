import { 
    POSTS_START_LOADING, POSTS_END_LOADING,
    GET_POSTS, GET_POST, GET_NUMBER_OF_POSTS,
    ADD_COMMENT_START, ADD_COMMENT_END, ADD_COMMENT_FAILED,
    DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILED,
    CREATE_POST_SUCCESS, CREATE_POST_FAILED,
    EDIT_POST_SUCCESS, EDIT_POST_FAILED,
    DELETE_POST_SUCCESS, DELETE_POST_FAILED,
    CLEAR_SUCCESS, CLEAR_MESSAGE
} from '../constants/actionTypes';

const initialState = { popularPost: {}, posts: [], currentPost: {}, numberOfPosts: 0, loading: false, message: '', success: false, commentLoading: false };

const postReducer = (state = initialState, action) => {
    switch(action.type) {
        case POSTS_START_LOADING: return { ...state, loading: true }
        case POSTS_END_LOADING: return { ...state, loading: false }

        case GET_POSTS: return { ...state, posts: action.payload }
        case GET_POST: return { ...state, currentPost: action.payload }
        case GET_NUMBER_OF_POSTS: return { ...state, numberOfPosts: action.payload }

        case ADD_COMMENT_START: return { ...state, commentLoading: true }
        case ADD_COMMENT_END: return { ...state, commentLoading: false }
        case ADD_COMMENT_FAILED: return { ...state, message: action.payload }

        case DELETE_COMMENT_SUCCESS: return { ...state, message: action.payload }
        case DELETE_COMMENT_FAILED: return { ...state, message: action.payload }

        case CREATE_POST_SUCCESS:
        case EDIT_POST_SUCCESS:
        case DELETE_POST_SUCCESS:
            return { ...state, message: action.payload, success: true }
        
        case CREATE_POST_FAILED:
        case EDIT_POST_FAILED:
        case DELETE_POST_FAILED:
            return { ...state, message: action.payload, success: false }

        case CLEAR_SUCCESS: return { ...state, success: false }
        case CLEAR_MESSAGE: return { ...state, message: '' }

        default: return state;
    }
}

export default postReducer;