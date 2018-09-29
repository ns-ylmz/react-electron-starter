import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// pages
import Home from './pages/home';
import Series from './pages/series';
import Episode from './pages/episode';

import 'font-awesome/scss/font-awesome.scss';
import 'bulma/bulma.sass';

const rootElement = document.getElementById('root');

render(
	<BrowserRouter>
		<div className="container is-fluid">
			<Switch>
				<Route exact path='/' component={Home} />
				<Route path='/series/:id' component={Series} />
				<Route path={'/episode/:id'} component={Episode} />
				<Route component={Home} />
			</Switch>
		</div>
	</BrowserRouter>,
	rootElement
);