import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

import { useDispatch } from 'react-redux';
import { deleteComment } from '../../actions/posts';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Comment = (props) => {
    const dispatch = useDispatch();

    const options = { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'}
    const dateString = new Date(props.date).toLocaleDateString('pl-PL', options);
    
    const token = Cookies.get('token');
    const { _id } = token ? jwt_decode(token) : { _id: null };

    return (
        <div className="comment">
            <div className="comment-head">
                <p className="author">{props.author}</p>
                <p className="date">{dateString}</p>

                {_id == props.authorID && (
                    <ion-icon name="close-outline" onClick={() => { 
                        confirmAlert({
                            title: 'Usuń komentarz',
                            message: 'Czy na pewno chces usunąć swój komentarz? Nie można tego odwrócić',
                            buttons: [
                                { 
                                    label: 'Usuń',
                                    onClick: () => {
                                        dispatch(deleteComment(props._id, props.id));
                                        props.refresh();
                                    }
                                },
                                {
                                    label: 'Anuluj',
                                    onClick: () => {}
                                }
                            ]
                        })
                        
                    }}/>
                )}
            </div>

            <p className="content">{props.content}</p>
        </div>
    )
}

export default Comment;
