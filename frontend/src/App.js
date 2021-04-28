import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Video } from './pages/Video';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path='/:id' component={ Video } />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
