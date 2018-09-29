// npm packages
import React, { Component } from 'react';

// our packages
import db from '../db';
import { Crunchyroll } from '../api';

export default class Episode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            episode: null
        };

        const { location } = props;
        Crunchyroll.getEpisode(location.state);
    }

    render() {
        return (
            <div>
                episode video here
            </div>
        );
    }
};