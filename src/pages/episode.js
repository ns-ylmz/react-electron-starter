// npm packages
import React, { Component } from 'react';

// our packages
import db from '../db';
import { Crunchyroll } from '../api';

export default class Episode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            episode: null,
            file: null
        };

        // trigger episode loading
        this.init(props);
    }

    async init(props) {
        const { location } = props;
        const file = await Crunchyroll.getEpisode(location.state);
        this.setState({
            episode: location.state,
            file
        });
    }

    componentDidUpdate() {
        const { episode, file } = this.state;

        if (!episode || !file) return;

        videojs('video', {
            fluid: true,
            plugins: {
                ass: {
                    src: file.subtitles
                }
            }
        });
    }

    componentWillUnmount() {
        videojs('video').dispose();
    }

    render() {
        const { episode, file } = this.state;
        const { history } = this.props;

        let body = <div>Loading...</div>;

        if (episode || file) {
            body = (
                <video
                    id="video"
                    className="video-js vjs-default-skin vjs-big-play-centered vjs-fluid"
                    controls
                    autoPlay
                    preload="auto"
                >
                    <source src={file.url} type={file.type} />
                </video>
            );
        }

        return (
            <div>
                <nav className="nav">
                    <div className="nav-left nav-menu">
                        <div className="nav-item">
                            <a href="#back" className="button" onClick={() => history.goBack()}>
                                <span className="icon">
                                    <i className="fa fa-arrow-left" />
                                </span>
                                <span>Back</span>
                            </a>
                        </div>
                    </div>
                </nav>

                <div className="columns">
                    <div className="column">
                        {body}
                    </div>
                </div>
            </div>

        );
    }
};