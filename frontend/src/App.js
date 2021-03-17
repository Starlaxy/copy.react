import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header';
import Footer from './components/Footer';
import { Top } from './top/pages/Top';
import { ProjectList } from './project/pages/ProjectList';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Header />
                    <div>
                        <Switch>
                            <Route exact path='/' component={Top} />
                            <Route exact path='/projectlist' component={ProjectList}/>
                        </Switch>
                    </div>
                    <Footer />
                </Router>
            </div>
        );
    }
}

export default App;