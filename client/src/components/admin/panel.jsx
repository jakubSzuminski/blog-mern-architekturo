import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { adminAuth } from '../../actions/user';
import { getPosts, getNumberOfPosts, clearSuccess, clearMessage } from '../../actions/posts';

import AdminPost from './post';
import Loader from '../loader';

const AdminPanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { admin, loading: userLoading } = useSelector(state => state.user);
    const { posts, numberOfPosts, loading, message } = useSelector(state => state.post);
    const [authStarted, setAuthStarted] = useState(false);

    useEffect(() => {
        setAuthStarted(true);
        dispatch(adminAuth());
        dispatch(getNumberOfPosts());
        dispatch(getPosts());
        dispatch(clearSuccess());
    }, []);

    useEffect(() => {
        if(authStarted && !userLoading && !admin) navigate('/');
    }, [authStarted, userLoading])

    useEffect(() => {
        dispatch(getPosts(null, null, numberOfPosts));
    }, [numberOfPosts]);

    if(loading || userLoading) {
        return (
            <section id="admin" className="container">
                <Loader h={250} w={250}/>
            </section>
        )
    }

    return (
        <section id="admin" className="container">
            { message && <div className="message message-success">{message}</div> }
            <h1>Panel Admina</h1>

            <div className="admin-container">
                <div className="admin-posts">
                    <h2>Historia dodanych postów</h2>
                    <div className="admin-posts-container">
                    { posts.length > 0 ? (
                        posts?.map((p, ind) => (
                            <AdminPost key={ind} title={p.title} description={p.description} date={p.datePosted} tags={p.tags} slug={p?.slug || 'none'} image = {p?.image || null} />
                        ))
                    ) : (
                        <p className="no-posts">Nie znaleziono postów...</p>
                    )}
                </div>
                </div>

                <div className="admin-actions">
                    <h2>Możliwe czynności</h2>
                    <Link to="/admin/creator" onClick={() => dispatch(clearMessage())}>Utwórz nowy post</Link>
                </div>
            </div>    
        </section>
    )
}

export default AdminPanel;