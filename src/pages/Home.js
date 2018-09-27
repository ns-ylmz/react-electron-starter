// npm packages
import React, { Component } from 'react';
import { Observable } from 'rxjs/Rx';

// our packages
import Series from '../components/series';
import db from '../db';
import { Crunchyroll } from '../api';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: []
        };
        // trigger the list update
        Crunchyroll.getAllSeries();
    }

    componentDidMount() {
        this.sub = Observable.fromEvent(
            db.series.changes({
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
        .subscribe(series => this.setState({ series }));
    }

    componentWillUnmount() {
        this.sub.unsubscribe();
    }

    render() {
        const { series } = this.state;

        return (
            <div>
                {series.map((s, index) => 
                    <Series key={`series__${s._id}`} series={s} />
                )}
            </div>
        );
    }
}