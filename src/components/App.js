import React, {Component} from 'react';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
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
import ItemByCatagory from './itemsByCategory'
import TermsAndConditions from './termsandconditions'
import Welcome from './welcomescreen'

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={Welcome} />
        <Route path='/site' component={Site}>
          <Route path="/category/:category" component={ItemByCatagory} />
          <Route path="/login" component={Login} />
          <Route path='/home' component={Home} />
          <Route onEnter={requireAuth}>
            {/* Place all authenticated routes here */}
            <Route path='/termsofservice' component={TermsAndConditions} />
            <Route path="/public/profile/:userid" component={Profile} />
            <Route path="/profile/edit" component={EditProfile} />
            <Route path="/profile/addItem" component={AddItem} />
            <Route path="/profile/myItems" component={ProfileItems} />
            <Route path="/profile/myItems/:item" component={ProfileItemDetails} />
            <Route path="/profile/myOffers" component={MyOffers}/>
            <Route path="/profile/makeOffer/profile/:userid/item/:item" component={MakeOffer}/>
            <Route path='/public/itemDetails/profile/:userid/item/:item' component={PublicItemDetails} />
          </Route>
        </Route>
      </Router>
    );
  }
}

export default App;
