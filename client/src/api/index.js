import Cookies from 'js-cookie';
import axios from 'axios';

const apiURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:5000/api' : '/api';

axios.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${Cookies.get('token')}`;
        return config;
    }
)

//Auth API
export const login = (email, password) => axios.post(`${apiURL}/auth/login`, { email, password });
export const register = (nickname, email, password, passwordConfirm) => axios.post(`${apiURL}/auth/register`, { nickname, email, password, passwordConfirm });

//User API
export const addToNewsletter = (email) => axios.post(`${apiURL}/user/add-to-newsletter`, { email });

//Posts API
export const getPosts = (search, tags, limit) => axios.get(`${apiURL}/posts/get-posts?page=${limit}&search=${search || 'none'}&tags=${tags?.join(',') || ''}`);
export const getPost = (slug) => axios.get(`${apiURL}/posts/get-post/${slug}`);
export const getNumberOfPosts = () => axios.get(`${apiURL}/posts/get-number-of-posts`);
export const addComment = (slug, comment) => axios.post(`${apiURL}/posts/add-comment`, { slug, comment });
export const deleteComment = (postID, commentID) => axios.delete(`${apiURL}/posts/delete-comment`, { headers: { postid: postID, commentid: commentID }});

//Admin API
export const adminAuth = () => axios.get(`${apiURL}/admin/authorize`);
export const createPost = (post) => axios.post(`${apiURL}/admin/create-post`, post);
export const editPost = (post) => axios.patch(`${apiURL}/admin/edit-post`, post);
export const deletePost = (postID) => axios.delete(`${apiURL}/admin/delete-post`, { headers: { postid: postID }});

