import { useEffect, useState } from "react";
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Cookies from 'js-cookie';

import { getPosts, getNumberOfPosts } from '../actions/posts';
import { addToNewsletter } from '../actions/user';

import tags from '../constants/tags';
import Post from './post/preview';
import Tag from './post/tag';

import { Fade } from 'react-awesome-reveal';
import Loader from './loader';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();

    const { logged, newsletter, email } = useSelector(state => state.user);
    const { posts, numberOfPosts, loading } = useSelector(state => state.post);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchTags, setSearchTags] = useState([]);

    const [error, setError] = useState('');
    const [mail, setMail] = useState('');

    const [showNewsletter, setShowNewsletter] = useState(true);

    useEffect(() => {
        dispatch(getPosts());
        dispatch(getNumberOfPosts());
        setShowNewsletter(Cookies.get('newsletter') !== 'yes');
    }, []);

    useEffect(() => {
        if(email) setMail(email);
    }, [email]);

    useEffect(() => {
        if(logged && newsletter) setShowNewsletter(false);
    }, [logged, newsletter]);

    const submit = (e) => {
        e?.preventDefault();
        dispatch(getPosts(search, searchTags, page || 1));
        
        if(!search && !(searchTags.length) && (page || 1) === 1) navigate('/');
        else navigate(`/?page=${page}&search=${search || 'none'}&tags=${searchTags.join(',')}`);
    }

    useEffect(() => {
        submit();
    }, [searchTags, page]);

    const toggleTag = (e, tag) => {
        if(!searchTags.includes(tag)) {
            setSearchTags(searchTags.concat(tag));
            e.currentTarget.classList.add('active');
        } else {
            const newSearchTags = [...searchTags];
            newSearchTags.splice(newSearchTags.indexOf(tag), 1);
            setSearchTags(newSearchTags);
            e.currentTarget.classList.remove('active');
        }
    }

    const isValidEmail = (arg) => {
        return /\S+@\S+\.\S+/.test(arg);
    }

    const validate = () => {
        if(isValidEmail(mail)) return true;

        setError('Podaj prawidłowy adres email');
        return false;
    }

    const newsletterSubmit = (e) => {
        e?.preventDefault();
        if(!validate()) return;
        dispatch(addToNewsletter(mail));
        Cookies.set('newsletter', 'yes', { expires: 1 });
    }

    return (
        <div id="home-container" className="container">
            <section id="posts">
                { loading ? <Loader h={100} w={100}/>
                : (
                <>
                <h2 className="mb-1">Najnowsze posty</h2>
                <div className="posts-container">
                    { (Array.isArray(posts) && posts.length > 0) ? (
                        posts?.map((p, ind) => (
                            <Fade key={ind}>
                                <Post title={p.title} description={p.description} date={p.datePosted} tags={p.tags} searchTag={toggleTag} slug={p?.slug || 'none'} image = {p?.image || null} />
                            </Fade>
                        ))
                    ) : (
                        <p className="no-posts">Nie znaleziono postów...</p>
                    )}
                </div>
                
                { (Array.isArray(posts) && posts.length > 0) && (
                <div className="posts-load-more">
                    { (page * 3) < numberOfPosts ? ( 
                        <button onClick={() => setPage(page + 1)}>Załaduj więcej</button>
                    ) : <p>Wszystkie posty załadowane!</p>}
                </div>
                )}
                </>
                )}
            </section>
            
            <section id="search">
                <div className="search-bar">
                    <h2 className="mb-1">Przeszukaj posty</h2>
                    <form onSubmit={submit}>
                        <input type="text" placeholder="Przeszukaj wszystkie posty..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                        <button type="submit">Szukaj</button>
                    </form>
                </div>

                <div className="search-tags">
                    <h2 className="mb-1">Wybierz tematykę</h2>
                    <div className="search-tags-container">
                        {tags.map((tag, ind) => (
                        <Tag name={tag} key={ind} searchTag={(e) =>
                        toggleTag(e, tag)}/>
                        ))}
                    </div>
                </div>
                
                {showNewsletter && (
                <div id="newsletter">
                    <h2 className="mb-1">Zapisz się do newsletter</h2>
                    <p className="mb-1">Dołącz do ponad 500 zadowolonych użytkowników otrzymujących praktyczne porady!</p>
                    
                    {error && <p className="newsletter-error">{error}</p>}
                    <form onSubmit={(e) => newsletterSubmit(e)}>
                        <input id="newsletter-email" type="text" placeholder="email" value={mail} onChange={(e) => setMail(e.target.value)}/>
                        <button id="newsletter-submit" type="submit">Dołącz</button>
                    </form>
                </div>
                )}
            </section>
        </div>
    )
}

export default Home;