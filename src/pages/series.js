// npm packages
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Observable } from 'rxjs/Rx';

// our packages
import Episode from '../components/episode';
import db from '../db';
import { Crunchyroll } from '../api';

export default class Series extends Component {
    constructor(props) {
        super(props);

        this.state = {
            episodes: []
        };

        // trigger episode loading
        this.init(props);
    }

    componentDidMount() {
        this.sub = Observable.fromEvent(
            db.episodes.changes({
                since: 0,
                live: true,
                include_docs: true
            }),
            'change'
        ).map(changes => changes[0])
        .filter(change => !change.deleted)
        .map(change => change.doc)
        .scan((acc, doc) => acc.concat([doc]), [])
        .debounceTime(1000)
        .subscribe(episodes => this.setState({ episodes }));
    }

    async init(props) {
        const { location } = props;
        await Crunchyroll.getEpisodes(location.state);
    }

    render() {
        const { episodes } = this.state;

        return (
            <div>
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
                {_.chunk(episodes, 4).map((chunk, index) => (
                    <div className='columns' key={`chunk__${index}`}>
                        {chunk.map(ep =>
                            <Episode key={`series__${ep._id}`} episode={ep} />
                        )}
                    </div>
                ))}
            </div>
        );
    }
};