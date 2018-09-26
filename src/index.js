import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

// import 'babel-polyfill';

// pages
import Home from './pages/Home';
import Other from './pages/Other';

const rootElement = document.getElementById('root');

render(
	<BrowserRouter>
		<div>
			<ul>
				<li><Link to='/'>Home</Link></li>
				<li><Link to='/other'>Other</Link></li>
			</ul>
			
			<hr/>

			<Switch>
				<Route exact path='/' component={Home} />
				<Route path='/other' component={Other} />
				<Route component={() => <div><h1>Select route</h1></div>} />
			</Switch>
		</div>
	</BrowserRouter>,
	rootElement
);