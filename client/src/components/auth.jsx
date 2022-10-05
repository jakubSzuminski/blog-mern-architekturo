import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { login, register } from '../actions/user';

import { CSSTransition } from 'react-transition-group';
import Loader from './loader';

const Auth = ({ signUp }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { registered, logged, error: serverError, loading } = useSelector(state => state.user);

    useEffect(() => {
        setMessage('');
    }, []);

    useEffect(() => {
        if(logged) navigate(-1);
    });

    useEffect(() => {
        setError(serverError);  
    }, [serverError]);

    useEffect(() => {
        setError('');
    }, [signUp]);

    useEffect(() => {
        if(registered) {
            navigate('/login');
            setMessage('Zarejestrowano pomyślnie'); 
        }
    }, [registered])

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }    

    const validate = () => {
        if(signUp && nickname.length < 6) setError('Login musi mieć conajmniej 6 znaków.');
        else if (signUp && nickname.length > 20) setError('Login musi mieć mniej niż 20 znaków.');
        else if (signUp && password != passwordConfirm) setError('Hasła nie zgadzają się.');
        else if (signUp && password.length < 8) setError('Hasło musi mieć conajmniej 8 znaków.');
        else if (!isValidEmail(email)) setError('Nieprawidłowy email.');
        else {
            setError('');
            return true;
        }

        return false;
    }

    const submit = async (e) => {
        e.preventDefault();
        if(!validate()) return;

        if(signUp) {
            dispatch(register(nickname, email, password, passwordConfirm));
        } else {
            dispatch(login(email, password));
        }

        if(serverError) {
            setError(serverError);
        }
    }

    return (
        <section id="auth">
            <div className="container-narrow">
                { message && (
                    <div className="message message-success">
                        <p>{message}</p>
                    </div>
                )}

                <div className="auth-header mb-2">
                    <h1>{ signUp ? "Zarejestruj się!" : "Zaloguj się"}</h1>
                    { loading && (
                    <Loader h={50} w={50}/>
                    )}
                </div>

                <CSSTransition in={error} timeout={200} classNames="basic">
                    <div className="form-errors">
                        <p>{error}</p>
                    </div>
                </CSSTransition>
                
                <form onSubmit={submit} className="mb-3">
                    { signUp && (
                        <fieldset>
                        <label htmlFor="nickname">Login</label>
                        <input id="nickname" type="text" placeholder="james123" value={nickname} onChange={(e) => setNickname(e.target.value)}/> 
                        </fieldset>
                    )}
                    
                    <fieldset>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="text" placeholder="jacob123@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="password">Hasło</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </fieldset>

                    { signUp && (
                        <fieldset>
                            <label htmlFor="password2">Potwierdź hasło</label>
                            <input id="password2" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
                        </fieldset>
                    )}

                    <button type="submit" className="button-filled">
                        { signUp ? 'Zarejestruj się' : 'Zaloguj się'}
                    </button>
                </form>

                <div className="auth-form-additional">
                    { signUp ? (
                        <p>Masz już konto? <Link to="/login">Zaloguj się tutaj</Link></p>
                    ) : (
                        <p>Nie masz konta? <Link to="/register">Zarejestruj się tutaj</Link></p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Auth;