import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

// pages
import Home from './pages/home';
import Series from './pages/series';
import Episode from './pages/episode';

import 'font-awesome/scss/font-awesome.scss';
import 'bulma/bulma.sass';
import 'video.js/dist/video-js.min.css';
import 'videojs-ass/src/videojs.ass.css';

import videojs from 'video.js';
import libjass from 'libjass';
import 'videojs-contrib-hls';
window.videojs = videojs;
window.libjass = libjass;
require('videojs-ass');

const rootElement = document.getElementById('root');

render(
	<HashRouter>
		<div className="container is-fluid">
			<Switch>
				<Route exact path='/' component={Home} />
				<Route path='/series/:id' component={Series} />
				<Route path={'/episode/:id'} component={Episode} />
				<Route component={Home} />
			</Switch>
		</div>
	</HashRouter>,
	rootElement
);