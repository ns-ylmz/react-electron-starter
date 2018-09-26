// npm packages
import React, { Component } from 'react';

// our packages
import db from '../db/';


export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.init();
    }

    async init() {
        const info = await db.info();
        console.log('DB Info:', info);
    }

    render() {
        return (
            <div>
                <h1>Home Page</h1>
            </div>
        );
    }
}