import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404</h1>
            <p>Error. La página que estas buscando no existe.</p>
            <Link to="/" className="go-home">Volver a la Homepage</Link>
        </div>
    );
};

export default NotFound;
