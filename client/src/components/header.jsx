import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getUserData, logout } from '../actions/user';

import Loader from './loader';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { logged, loading } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getUserData());
    }, []);

    return (
        <header>
            <div className="container">
                <Link to='/' className="logo">Archi<span>tekturo</span></Link>
                
                <nav id="main-nav">
                    <ul>
                        <li> <Link to='/contact'>Kontakt</Link> </li>

                        { loading ? <Loader h={15} w={15}/> 
                        : (
                            <>
                            { logged ? (
                                <li> <button onClick={() => { dispatch(logout()); navigate('/'); }}>Wyloguj się</button> </li>
                            ) : (
                                <>
                                    <li> <Link to='/login'>Logowanie</Link> </li>
                                    <li> <Link to='/register'>Rejestracja</Link> </li>
                                </>
                            )}
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;