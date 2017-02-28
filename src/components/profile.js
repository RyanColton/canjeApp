import React, {Component} from 'react';
import {button} from 'semantic-ui-react';
import {connectProfile} from '../auth';
import './profile.css';

class Profile extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  render() {
    const {profile} = this.props;
    const user_metadata = profile.user_metadata || {};

    console.log(profile)
    return (
      <div className="profileBody">
      <img className="profileImg" src={profile.picture_large}/>
      <h1>{profile.name}</h1>
      <div className="profileInfo">
        <p><strong>Username:</strong> {user_metadata.username || 'None'}</p>
        <p><strong>Location:</strong> {user_metadata.location || 'Private'}</p>
        <p><strong>Email:</strong> {user_metadata.email || 'private'}</p>
        <p><strong>Phone:</strong> {user_metadata.phone || 'private'}</p>
        <p><strong>Personal Bio:</strong> {user_metadata.personalBio || 'private'}</p>
      </div>



      </div>
    )
  }
}
export default connectProfile(Profile);
