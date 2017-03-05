import React, {Component} from 'react';
import {Button, Image, Input, Divider, Label, TextArea} from 'semantic-ui-react';
import {connectProfile} from '../auth';
import './EditProfile.css';

class EditProfile extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };
  constructor(){
    super()
    this.checkForUser = this.checkForUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.newUser = this.newUser.bind(this)
  }
  checkForUser = (id) => {
    return fetch(`/api/profile/check?userid=${id}`, {method: 'get'}).then((r)=>r.json()).catch((err)=>{console.log(err)})
  }
  updateUser = (data)=>{
    console.log('Update Run')
    return fetch('/api/profile/update', {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    })
  }
  newUser = (data)=>{
    console.log('User Added')
    return fetch(`/api./profile/new`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    })
  }
  state = {
    error: null,
    saved: false,
    saving: false,
    exists: null
  }

  render() {
    const {profile} = this.props;
    const {saving, saved} = this.state;
    const user_metadata = profile.user_metadata || {};

    return (

      <div className="EditProfile">
        <Image src={profile.picture_large} shape='rounded' className='EditProfile-profileImage'/>
        <div className="EditProfile-editBody">
          <div className="EditProfile-heading">{profile.name}</div>
          <Divider />
          <form className="EditProfile-form" onSubmit={this.onSubmit} onChange={this.onClearSaved}>
            <fieldset className="EditProfile-fieldset" disabled={saving}>
              <div className="EditProfile-inputDiv">
                <Label className="EditProfile-locationLabel" htmlFor="location" content='Location' size='big' />
                <Input
                  icon="location arrow"
                  iconPosition="left"
                  onChange={(e)=>this.locationInput = e.target.value}
                  id="location"
                  type="text"
                  placeholder="City or State"
                  defaultValue={user_metadata.location}
                />
              </div>
             <Divider />
             <div className="EditProfile-inputDiv">
                <Label className="EditProfile-locationLabel" htmlFor="username" content="Username" size="big"/>
                <Input
                  icon='user'
                  iconPosition='left'
                  onChange={(e)=>this.usernameInput = e.target.value}
                  id="username"
                  type="text"
                  placeholder="Username"
                  defaultValue={user_metadata.username}
                />
              </div>
             <Divider />
             <div className="EditProfile-inputDiv">
                <Label className="EditProfile-locationLabel" htmlFor="email" content="Email" size='big'/>
                <Input
                  onChange={(e)=>this.emailInput = e.target.value}
                  icon="mail"
                  iconPosition="left"
                  id="email"
                  type="text"
                  placeholder="Email Address"
                  defaultValue={user_metadata.email}
                />
              </div>
              <Divider />
              <div className="EditProfile-inputDiv">
                <Label className="EditProfile-locationLabel" htmlFor="phone" content="Phone" size='big'/>
                <Input
                 onChange={(e)=>this.phoneInput = e.target.value}
                 icon="phone"
                 iconPosition="left"
                 id="mail"
                 type="text"
                 placeholder="Phone Number"
                 defaultValue={user_metadata.phone}
                 />
              </div>
              <Divider />
                <Label className="EditProfile-locationLabel" htmlFor="itemsWanted" content="Items Wanted" size="big"/>
                <TextArea
                  onChange={(e)=>this.itemsWantedInput = e.target.value}
                  className="EditProfile-PersonalBioInput"
                  id="itemsWanted"
                  type="text"
                  placeholder="What are you looking for?"
                  defaultValue={user_metadata.itemsWanted}
                  autoHeight
                />
               <Divider />
               <Label className="EditProfile-locationLabel" htmlFor="personalBio" content="Personal Bio" size="big"/>
               <TextArea
                 onChange={(e)=>this.personalBioInput = e.target.value}
                 className="EditProfile-PersonalBioInput"
                 id="personalBio"
                 type="text"
                 placeholder="Explain a bit about yourself"
                 defaultValue={user_metadata.personalBio}
                 autoHeight
               />
              <div className="EditProfile-formControls">
                <Button color="teal" size="big" className="EditProfile-submitButton" type="submit">
                  {saving ? 'Updating...' : 'Update'}
                </Button>
                {saved && (
                  <div className="EditProfile-saved">Updated</div>
                )}
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }

  componentDidMount(){
    this.checkForUser(this.props.profile.identities[0].user_id).then((response)=>this.setState({exists: response[0].exists})).then(()=>console.log(this.state.exists))
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({saving: true}, async () => {
      const error = await this.props.onUpdateProfile({
        user_metadata: {
          location: this.locationInput,
          username: this.usernameInput,
          email: this.emailInput,
          phone: this.phoneInput,
          itemsWanted: this.itemsWantedInput,
          personalBio: this.personalBioInput
        }
      });
      let data = {
        userid: this.props.profile.identities[0].user_id,
        userImage: this.props.profile.picture_large,
        thumbnail: this.props.profile.picture,
        userFirstName: this.props.profile.given_name,
        useremail: this.emailInput,
        userphone: this.phoneInput,
        location: this.locationInput,
        personalbio: this.personalBioInput,
        itemswanted: this.itemsWantedInput,
        username: this.usernameInput,
        userLastName: this.props.profile.family_name
      }
      console.log(data)
      data = JSON.stringify(data)
      !this.state.exists ? this.newUser(data) : this.updateUser(data)
      this.setState({error, saved: !error, saving: false});
    });
  }

  onClearSaved = (event) => {
    this.setState({saved: false});
  }
}

export default connectProfile(EditProfile);
