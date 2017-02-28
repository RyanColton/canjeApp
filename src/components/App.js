import React, {Component} from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {requireAuth} from '../auth';
import Site from './Site';
import Home from './Home';
import Login from './Login';
import EditProfile from './EditProfile';
import Profile from './profile';
import AddItem from './addItem';
import ProfileItems from './profileItems'
import ProfileItemDetails from './profileItemDetails'
import PublicItemDetails from './publicItemDetails'
import MyOffers from './myOffers'
import MakeOffer from './makeOffer'

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={Site}>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />

          <Route onEnter={requireAuth}>
            {/* Place all authenticated routes here */}
            <Route path="/profile" component={Profile} />
            <Route path="/profile/edit" component={EditProfile} />
            <Route path="/profile/addItem" component={AddItem} />
            <Route path="/profile/myItems" component={ProfileItems} />
            <Route path="/profile/myItems/:item" component={ProfileItemDetails} />
            <Route path="/profile/myOffers" component={MyOffers}/>
            <Route path ="/profile/makeOffer/profile/:userid/item/:item" component={MakeOffer}/>
            <Route path='/public/itemDetails/profile/:userid/item/:item' component={PublicItemDetails} />
          </Route>
        </Route>
      </Router>
    );
  }
}

export default App;
