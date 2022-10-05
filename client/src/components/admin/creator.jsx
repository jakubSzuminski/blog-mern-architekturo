import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { adminAuth } from '../../actions/user';
import { getPost, createPost, editPost, deletePost } from '../../actions/posts';

import { WithContext as ReactTags } from 'react-tag-input';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../loader';

const PostCreator = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const { admin, loading: userLoading } = useSelector(state => state.user);
    const { currentPost: post, loading, message, success } = useSelector(state => state.post);

    const [authStarted, setAuthStarted] = useState(false);

    useEffect(() => {
        setAuthStarted(true);
        dispatch(adminAuth());
    }, []);

    useEffect(() => {
        const slug = params?.slug || 'none';
        if(slug && slug !== 'none') {
            console.log('we in edit mode!');
            dispatch(getPost(slug));
            setEditMode(true);
        } else {
            setEditMode(false);
        }
    }, []);

    useEffect(() => {
        if(authStarted && !userLoading && !admin) navigate('/');
    }, [authStarted, userLoading]);
    
    useEffect(() => {
        if(editMode && post) {
            console.log(post.date);

            setTitle(post?.title);
            setDescription(post?.description);
            setTags(post.tags.map(tag => ({ id: tag, text: tag})) || []);

            setSlug(post?.slug);
            setImage(post?.image);
            setDate(post.date.substring(0, 16));
            setAuthor(post?.author);

            const htmlcode = htmlToDraft(post.content);
            console.log(htmlcode);
            const { contentBlocks, entityMap } = htmlcode;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            setEditorState(EditorState.createWithContent(contentState))
        }
    }, [post]);

    useEffect(() => {
        if(success) navigate('/admin');
    }, [success]);

    useEffect(() => {
        if(message && !success) setError(message);
    }, [message]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState('');
    const [date, setDate] = useState((new Date()).toISOString().substring(0, 16));
    const [author, setAuthor] = useState('');

    const [error, setError] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const validatePost = () => {
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        if(title.length < 10) setError('Tytuł musi mieć conajmniej 10 znaków');
        else if(title.length > 65) setError('Tytuł musi mieć mniej niż 75 znaków');
        else if(description.length < 10) setError('Opis musi mieć conajmenij 10 znaków');
        else if(description.length > 350) setError('Opis musi mieć mniej niż 350 znaków');
        else if(slug.length < 5) setError('Musisz podać prawidłowy slug');
        else if(content.length < 10) setError('Dodaj treść!');
        else {
            setError('');
            return true;
        }
        
        return false;
    }

    const handleDelete = i => { setTags(tags.filter((tag, index) => index !== i)) }
    const handleAddition = tag => { setTags([...tags, tag]) }
    const handleDrag = (tag, currentPos, newPos) => {
        const newTags = tags.slice();
        newTags.splice(currentPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    }
    const handleTagClick = ind => {
        console.log('The tag at index ' + ind + ' was clicked');
    }

    const submit = (e) => {
        e.preventDefault();
        if(!validatePost()) return;

        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        if(editMode) dispatch(editPost({ id: post._id, title, description, tags, slug, image, date, author, content }));
        else dispatch(createPost({ title, description, tags, slug, image, date, author, content }));
    }

    const submitDeletePost = (e) => {
        e.preventDefault();

        confirmAlert({
            title: 'Usuń post',
            message: 'Czy na pewno chcesz usunąć ten post?',
            buttons: [
                { 
                    label: 'Tak',
                    onClick: () => {    
                        dispatch(deletePost(post._id));
                        navigate('/admin');
                    }
                },
                {
                    label: 'Nie',
                    onClick: () => {}
                }
            ]
        });
    }

    if(userLoading || loading) {
        return (
            <section id="post-creator" className="container">
                <Loader h={250} w={250}/>
            </section>
        )
    }

    return (
        <section id="post-creator" className="container">
            <form className="post-creator-form" onSubmit={(e) => submit(e)}>
                {error && (
                    <p className="message message-error">{error}</p>
                )}

                <div className="post-creator-form-header">
                    <h1> { editMode ? 'Edytuj post' : 'Stwórz nowy post' }</h1>
                    { editMode && <button onClick={(e) => submitDeletePost(e)}>Usuń post</button> }
                </div>

                <fieldset>
                    <label htmlFor="title">Tytuł</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </fieldset>
                
                <fieldset>
                    <label htmlFor="description">Opis</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </fieldset>

                <fieldset>
                    <label htmlFor="tags">Tagi</label>
                    <ReactTags 
                        tags={tags} 
                        delimiters={[188, 13]}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        handleTagClick={handleTagClick}
                        inputFieldPosition="top"
                        placeholder="Tu wpisz tagi (enter lub przecinek rozdziela)"
                        inline
                        autocomplete
                    />
                </fieldset>
                
                <div className="form-2">
                    <fieldset>
                        <label htmlFor="slug">Slug (link)</label>
                        <input type="text" id="slug" placeholder="witaj-na-naszym-blogu" value={slug} onChange={(e) => setSlug(e.target.value)}/>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="image">Zdjęcie <span>opcjonalne</span> </label>
                        <input type="text" id="image" placeholder="Link do zdjęcia" value={image} onChange={(e) => setImage(e.target.value)}/>
                    </fieldset>
                </div>
                

                <div className="form-2 mb-4">
                    <fieldset>
                        <label htmlFor="date">Data dodania <span>opcjonalne</span> </label>
                        <input type="datetime-local" id="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="author">Autor <span>opcjonalne</span></label>
                        <input type="text" id="author" placeholder="Imię i nazwisko" value={author} onChange={(e) => setAuthor(e.target.value)}/>
                    </fieldset>
                </div>
                

                <fieldset id="content-fieldset">
                    <label id="content-label">Treść</label>
                    <Editor 
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={(editorState) => setEditorState(editorState)}
                        placeholder="Write something!"
                    />
                </fieldset>

                <button type="submit">{ editMode ? 'Edytuj post' : 'Dodaj post' }</button>
            </form>
        </section>
    )  
}

export default PostCreator;