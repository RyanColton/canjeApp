import React, {Component} from 'react';
import {Button} from 'semantic-ui-react'
import {connectProfile, login, logout} from '../auth';
import {Link, browserHistory, hashHistory} from 'react-router'
import './welcomescreen.css';

class Welcome extends Component{

  static propTypes = {
    ...connectProfile.PropTypes,
  };

  render(){
    const profile = this.props.profile
    profile ? browserHistory.push('/profile/edit') : ""
    let loginButton = login
    return(
    <div className="WelcomeScreenPageContainer">
      <div className='WelcomeScreenInfoContainer' >
        <div>
          <p className="WelcomeScreenTitleText">CAN<span className="orange">J</span>E</p>
          <div className="WelcomeScreenSubTitleText">
            <p>Trade</p> <p className="red">Discover</p> <p>Barter</p>
          </div>
       </div>
        <Button size='large' onclick={()=>browserHistory.push('/login')}><Link to='/login' className="WelcomeScreenLinkText">Login</Link></Button>
      </div>
    </div>
  )
  }


}

export default connectProfile(Welcome)
