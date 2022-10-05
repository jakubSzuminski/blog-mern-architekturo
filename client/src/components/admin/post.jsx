import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearMessage } from '../../actions/posts';

const Post = ({ title, description, date, slug }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const goToPost = () => {
        dispatch(clearMessage());
        navigate(`/admin/edit-post/${slug}`);
    }   

    const options = { month: 'long', day: 'numeric', year: 'numeric'}
    const dateString = new Date(date).toLocaleDateString('pl-PL', options);

    return (
        <article className="admin-post">
            <div className="post-container">
                <p className="post-date">{dateString}</p>
                <h1 onClick={goToPost}> {title} </h1>
                <p className="post-description"> {description} </p>
            </div>
        </article>
    )
}

export default Post;