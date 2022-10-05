import { 
    USER_START_LOADING, USER_END_LOADING,
    LOGIN, LOGIN_FAILED, LOGOUT, 
    GET_USER_DATA, 
    ADD_TO_NEWSLETTER,
    REGISTRATION_SUCCESS, REGISTRATION_FAILED,
    ADMIN_SUCCESS, ADMIN_FAILED    
} from '../constants/actionTypes';

const initialState = { registered: false, logged: false, email: '', id: -1, newsletter: false, error: '', loading: false, admin: false };

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case USER_START_LOADING: return { ...state, loading: true }
        case USER_END_LOADING: return { ...state, loading: false }
        
        case REGISTRATION_SUCCESS: return { ...state, registered: true }
        case REGISTRATION_FAILED: return { ...state, error: action.payload }

        case LOGIN:
        case GET_USER_DATA:
            return {
                ...state,
                logged: true,
                email: action.payload.email,
                id: action.payload.id,
                newsletter: action.payload.newsletter,
                error: ''
            }
        
        case LOGIN_FAILED: return { ...state, error: action.payload }
        case LOGOUT: return initialState;
        
        case ADD_TO_NEWSLETTER: return { ...state, newsletter: true }

        case ADMIN_SUCCESS: return { ...state, admin: true }
        case ADMIN_FAILED: return { ...state, admin: false }

        default: return state;
    }
}

export default userReducer;