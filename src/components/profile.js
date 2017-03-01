import React, {Component} from 'react';
import {Image, Label, Divider} from 'semantic-ui-react';
import {browserHistory} from 'react-router'
import {connectProfile} from '../auth';
import './profile.css';

class Profile extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  getUser = () => {
    return fetch(`/api/users?userid=${this.props.params.userid}`, {method: 'get'}).then((r)=>r.json())
  }

  constructor(){
    super()
    this.state ={
      user: {}
    }
    this.getUser = this.getUser.bind(this)
  }

  render() {
    return (
      <div className="Profile-UserBody">
        <Image shape="rounded" className="Profile-UserImg" src={this.state.user.userimage}/>
        <div className="Profile-UserInfo">
            <div className="Profile-UserHeading">{this.state.user.userfirstname + " " + this.state.user.userlastname}</div>
            <Divider />
            <div className="Profile-InfoData">
                <div className="Profile-InfoSet">
                  <Label content='Username' size='big' />
                  <p className="Profile-InfoValue">{this.state.user.username || 'None'}</p>
                </div>
              <Divider />
                <div className="Profile-InfoSet">
                  <Label content='Location' size='big' />
                  <p className="Profile-InfoValue">{this.state.user.location || 'Private'}</p>
                </div>
              <Divider />
                <div className="Profile-InfoSet">
                  <Label content='Email' size='big' />
                  <p className="Profile-InfoValue">{this.state.user.useremail || 'private'}</p>
                </div>
              <Divider />
                <div className="Profile-InfoSet">
                  <Label content='Phone' size='big' />
                  <p className="Profile-InfoValue">{this.state.user.userphone || 'private'}</p>
                </div>
              <Divider />
                <div className="Profile-InfoSet">
                  <Label content='Items Wanted' size='big' />
                  <p className="Profile-InfoValue">{this.state.user.itemswanted || 'private'}</p>
                </div>
              <Divider />
                <div className="Profile-InfoSet">
                  <Label content='Bio' size='big' />
                  <p className="Profile-InfoValue">{this.state.user.personalbio || 'private'}</p>
                </div>
            </div>
        </div>
      </div>
    )
  }

  componentDidMount(){
    this.getUser().then((r)=>this.setState({user: r[0]}))
  }
}
export default connectProfile(Profile);
