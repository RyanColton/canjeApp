import React, {Component, PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import {connectProfile, logout, login} from '../auth';
import {Menu, Button, Icon} from 'semantic-ui-react'
import './Site.css';

class Site extends Component {

  newOffers = (profile) =>{
    return fetch(`/api/offers/check?userid=${profile.identities[0].user_id}`, {method: 'get'}).then((r)=>r.json()).catch((err)=>console.log(err))
  }

  constructor(){
    super()
    this.state = {
            activeItem: 'home',
            icon: <Icon name='star' color="red" />,
            newOffer: false
           }
    this.newOffers = this.newOffers.bind(this)
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })


  static propTypes = {
    ...connectProfile.PropTypes,
    children: PropTypes.any,
  };
s
  render() {
    let loginButton = logout
    let loginButtonText = 'Log Out'
    const profile = this.props.profile
    if(!profile){
      loginButton = login
      loginButtonText = 'Login'
    }
    const { activeItem } = this.state
    return (
    <div className="Site">
      <div>
        <Menu fixed="top" color={'teal'} inverted secondary>
        <Menu.Item header onClick={()=>browserHistory.push('/home')} >CANJE</Menu.Item>
        <Menu.Item name='aboutUs' active={activeItem === 'aboutUs'} onClick={(this.handleItemClick)} content="About"/>
        <Menu.Item position='right'>
          <Button onClick={loginButton}>{loginButtonText}</Button>
        </Menu.Item>
      </Menu>
      </div>
      <div className="main-menu" >
        <Menu vertical size="large" fixed="left" className="Site-VerticalMenu">
          <Menu.Item>
            <Menu.Header>For Trade</Menu.Header>

            <Menu.Menu>
              <Menu.Item name='All Items' active={activeItem === 'All Items'} onClick={()=>browserHistory.push('/home')}>
                All Items
              </Menu.Item>
              <Menu.Item name='Kichen' active={activeItem === 'Kitchen'} onClick={()=>browserHistory.push('/category/Kitchen')}>
                Kitchen
              </Menu.Item>
              <Menu.Item name='Bathroom' active={activeItem === 'Bathroom'} onClick={()=>browserHistory.push('/category/Bathroom')} >
                Bathroom
              </Menu.Item>
              <Menu.Item name='Living Room' active={activeItem === 'livingRoom'} onClick={()=>browserHistory.push('/category/LivingRoom')} >
                LivingRoom
              </Menu.Item>
              <Menu.Item name='Outdoors' active={activeItem === 'livingRoom'} onClick={()=>browserHistory.push('/category/Outdoors')} >
                Outdoors
              </Menu.Item>
              <Menu.Item name='Misc' active={activeItem === 'livingRoom'} onClick={()=>browserHistory.push('/category/Misc')} >
                Misc
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header>Profile</Menu.Header>

            <Menu.Menu>
              <Menu.Item name='Edit Profile' active={activeItem === 'editProfile'} onClick={()=>browserHistory.push('/profile/edit')}>
                Edit Profile
              </Menu.Item>
              <Menu.Item name='My offers' active={activeItem === 'Offers'} onClick={()=>browserHistory.push('/profile/myOffers')} >
                {this.state.newOffer? this.state.icon : ""}
                My Offers
              </Menu.Item>
              <Menu.Item name='My Items' active={activeItem === 'myItems'} onClick={()=>browserHistory.push('/profile/myItems')} >
                My Items
              </Menu.Item>
              <Menu.Item name='Add Item' active={activeItem === 'newItem'} onClick={()=>browserHistory.push('/profile/addItem')}>
                Add Item
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header>About</Menu.Header>

            <Menu.Menu>
              <Menu.Item name='F A Qs' active={activeItem === 'faq'} onClick={this.handleItemClick} />
                <Menu.Item name='Terms of Service' active={activeItem === 'tos'} onClick={()=>browserHistory.push('/termsofservice')} >
                  Terms of Service
                </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </div>

      <div className="Site-page">
        {this.props.children}
      </div>
    </div>
    );
  }

  componentDidMount(){
    const profile = this.props.profile
    profile ? this.newOffers(profile).then((r)=>this.setState({newOffer: r[0].exists})) : ''
  }

  renderUserControls() {
    const {profile} = this.props;

    if (profile) {
      return (
        <div className="Site-profileControls">
          <img className="Site-profilePicture" src={profile.picture} alt={profile.nickname} />
          <Link to="/profile/edit">{profile.nickname}</Link> &middot; <a onClick={() => logout()}>Log Out</a>
        </div>
      );
    } else {
      return (
        <div className="Site-profileControls">
          <span>Guest</span> &middot; <Link to="/login">Log In</Link>
        </div>
      );
    }
  }
}

export default connectProfile(Site);
