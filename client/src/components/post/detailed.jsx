import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { getPost, addComment } from '../../actions/posts';

import { CSSTransition } from 'react-transition-group';
import Loader from '../loader';

import parse from 'html-react-parser';

import Comment from './comment';

const PostView = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { logged } = useSelector(state => state.user);
    const { loading, commentLoading, currentPost: post } = useSelector(state => state.post);
    
    const [startedLoading, setStartedLoading] = useState(false);

    const [comment, setComment] = useState('');
    const [changed, setChanged] = useState(false);

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        dispatch(getPost(slug));
        setShowError(false);
        setStartedLoading(true);
    }, []);

    useEffect(() => {
        if(!startedLoading) return;
        if(!loading && Object.keys(post).length === 0) navigate('/404');
    }, [startedLoading, loading, post]);

    useEffect(() => {
        if(!commentLoading && changed) {
            dispatch(getPost(slug));
            setChanged(false);
        }
    }, [changed, commentLoading])

    useEffect(() => {
        console.log('Error status: ', error);
    }, [error]);
    
    const time = Math.ceil(post?.content?.length / 1800);

    const submit = (e) => {
        e.preventDefault();

        if(comment.length <= 2) {
            console.log('error');
            setError('Komentarz za krótki.');
            setShowError(true);
        }
        else if(comment.length > 600) {
            console.log('error');
            setError('Komentarz może mieć maksymalnie 600 znaków');
            setShowError(true);
        }
        else {
            dispatch(addComment(slug, comment));
            setComment('');
            setChanged(true);
            setError('');
            setShowError(false);
        }
    }

    if(loading) {
        return (
            <section className="post-detail">
                <Loader h={250} w={250}/>
            </section>
        )
    }

    return (
        <>
        <section className="post-detail">
            <div className="container-post-detail">
                <div className="image-container">
                    <img src={post.image}/>
                </div>
                
                <h1>{post.title}</h1>
                <p className="description">{post.description}</p>
                <p className="read-time">Przewidywany czas czytania: {time == 1 ? '1 minuta' : `${time} minut`}</p>   
                <hr></hr>

                <div className="post-detail-content">
                    {parse(post?.content || '')}
                </div>
            </div>
        </section>
        <section className="post-comments">
            <div className="container-post-detail">
                <h2>Komentarze</h2>

                <CSSTransition in={showError} timeout={200} classNames="basic">
                    <div className="form-errors">
                        <p>{error}</p>
                    </div>  
                </CSSTransition>

                <div className="post-comments-container">
                    {post?.comments?.length > 0 ? (post?.comments?.map((com, ind) => (
                        <Comment key={ind} authorID={com.authorID} author={com.author} content={com.content} date={com.date} id={com.id} _id={post._id} refresh={() => setChanged(true)}/>
                    ))) : (
                        <p className="no-comments">Skomentuj jako pierwszy!</p>
                    )}
                </div>
                
                {logged ? (
                    <form onSubmit={(e) => submit(e)}>
                        <textarea id="comment" placeholder="Twój komentarz tutaj..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                        <button type="submit">Dodaj komentarz</button>
                    </form>
                ) : (
                    <p className="not-logged"><Link to="/login">Zaloguj się</Link> by dodać komentarz!</p>
                )}
                
            </div>
        </section>
        </>
    )
}

export default PostView;