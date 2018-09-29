// npm packages
import _ from 'lodash';
import React, { Component } from 'react';
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

        const { location } = props;
        Crunchyroll.getEpisodes(location.state);
    }

    componentDidMount() {
        this.sub = Observable.fromEvent(
            db.episodes.changes({
                since: 0,
                live: true,
                include_docs: true
            }),
            'change'
        )
        .map(changes => changes[0])
        .filter(change => !change.deleted)
        .map(change => change.doc)
        .scan((acc, doc) => acc.concat([doc]), [])
        .debounceTime(1000)
        .subscribe(episodes => this.setState({ episodes }));
    }

    render() {
        const { episodes } = this.state;

        return (
            <div>
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