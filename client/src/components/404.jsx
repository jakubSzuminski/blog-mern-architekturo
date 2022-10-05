import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div id="not-found-page">
            <h1><span>404</span> Nie znaleziono</h1>
            <p>Przykro nam, ale nie znaleźliśmy strony, której szukasz</p>
            <Link to="/">Wróć na stronę główną</Link>
        </div>
    )
}

export default NotFound;