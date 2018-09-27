import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

// pages
import Home from './pages/Home';
import Other from './pages/Other';

import 'bulma/bulma.sass';

const rootElement = document.getElementById('root');

render(
	<BrowserRouter>
		<div className="container is-fluid">
			<Switch>
				<Route exact path='/' component={Home} />
				<Route path='/other' component={Other} />
				<Route component={Home} />
			</Switch>
		</div>
	</BrowserRouter>,
	rootElement
);