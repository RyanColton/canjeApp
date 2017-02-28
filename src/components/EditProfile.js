import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import {connectProfile} from '../auth';
import './EditProfile.css';

class EditProfile extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  state = {
    error: null,
    saved: false,
    saving: false
  }

  render() {
    const {profile} = this.props;
    const {saving, saved} = this.state;
    const user_metadata = profile.user_metadata || {};

    return (

      <div className="EditProfile">

        <div className="EditProfile-heading">Current Information</div>
        <div className="EditProfile-profile">
          <p><strong>Username:</strong> {user_metadata.username || 'unknown'}</p>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {user_metadata.email || 'unknown'}</p>
          <p><strong>Created At:</strong> {profile.created_at}</p>
          <p><strong>Location:</strong> {user_metadata.location || 'unknown'}</p>
          <p><strong>Personal Bio:</strong> {user_metadata.personalBio || 'none'}</p>

        </div>
        <div className="EditProfile-heading">Edit Profile</div>
        <form className="EditProfile-form" onSubmit={this.onSubmit} onChange={this.onClearSaved}>
          <fieldset className="EditProfile-fieldset" disabled={saving}>
            <label className="EditProfile-locationLabel" htmlFor="location"><strong>Location</strong></label>
            <input
              ref={(ref) => this.locationInput = ref}
              className="EditProfile-locationInput"
              id="location"
              type="text"
              placeholder="City or State"
              defaultValue={user_metadata.location}
            />
            <label className="EditProfile-usernameLabel" htmlFor="username"><strong>Username</strong></label>
            <input
              ref={(ref) => this.usernameInput = ref}
              className="EditProfile-locationInput"
              id="username"
              type="text"
              placeholder="Username"
              defaultValue={user_metadata.username}
            />
           <label className="EditProfile-emailLabel" htmlFor="email"><strong>Email</strong></label>
            <input
              ref={(ref) => this.emailInput = ref}
              className="EditProfile-locationInput"
              id="email"
              type="text"
              placeholder="Email Address"
              defaultValue={user_metadata.email}
            />
          <label className="EditProfile-phoneLabel" htmlFor="phone"><strong>Phone</strong></label>
             <input
               ref={(ref) => this.phoneInput = ref}
               className="EditProfile-locationInput"
               id="email"
               type="text"
               placeholder="Phone Number"
               defaultValue={user_metadata.phone}
             />
            <label className="EditProfile-personalBioLabel" htmlFor="personalBio"><strong>Personal Bio</strong></label>
             <textarea
               ref={(ref) => this.personalBioInput = ref}
               className="EditProfile-personalBioInput"
               id="personalBio"
               type="text"
               placeholder="Explain a bit about yourself"
               defaultValue={user_metadata.personalBio}
             />
            <div className="EditProfile-formControls">
              <Button color="teal" className="EditProfile-submitButton" type="submit">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              {saved && (
                <div className="EditProfile-saved">Saved</div>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    );
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({saving: true}, async () => {
      const error = await this.props.onUpdateProfile({
        user_metadata: {
          location: this.locationInput.value,
          username: this.usernameInput.value,
          email: this.emailInput.value,
          phone: this.phoneInput.value,
          personalBio: this.personalBioInput.value
        }
      });

      this.setState({error, saved: !error, saving: false});
    });
  }

  onClearSaved = (event) => {
    this.setState({saved: false});
  }
}

export default connectProfile(EditProfile);
