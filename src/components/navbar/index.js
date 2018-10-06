// npm packages
import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <nav className="nav">
            <div className="nav-left nav-menu">
                <div className="nav-item">
                    <Link to="/" className="button">
                        <span className="icon">
                            <i className="fa fa-arrow-left" />
                        </span>
                        <span>Back</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}