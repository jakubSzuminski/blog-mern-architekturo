import { useNavigate } from 'react-router-dom';

import Tag from './tag';

const Post = ({ image, title, description, date, tags, slug }) => {
    const navigate = useNavigate();

    const goToPost = () => {
        navigate(`/post/${slug}`);
    }   

    const options = { month: 'long', day: 'numeric', year: 'numeric'}
    const dateString = new Date(date).toLocaleDateString('pl-PL', options);

    return (
        <article className="post">
            <div className="post-image">
                <img src={image || 'images/posts/default.png'} alt="" onClick={goToPost}/>
            </div>
            
            <div className="post-container">
                <h1 onClick={goToPost}> {title} </h1>
                <p className="post-description"> {description} </p>
                <div className="post-additional">
                    <p className="post-date">{dateString}</p>
                    <div className="tags">
                        <ion-icon name="pricetag-outline" title="tag"></ion-icon>
                        { tags.map((tag, ind) => (
                            <Tag name={tag} key={ind}/>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Post;