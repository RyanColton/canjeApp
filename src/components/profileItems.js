import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Button, Dimmer, Header, Image} from 'semantic-ui-react'
import {Link} from 'react-router';
import './profileItems.css'

let apiCallUrl
let profile
let profileItems = []
let itemDetails = {}
const getProfileItems = () => {
  return fetch(apiCallUrl, {method: 'get'}).then((response) => response.json()).catch((err) => console.log(err))
}

const getDetails = (id) => {
  let apiDetailCall = '/api/profile/item?itemid=' + id;
  this.setState({detailsToggle: true})
  return fetch(apiDetailCall, {method: 'get'}).then((response) => response.json()).then((response) => itemDetails = response).catch((err) => console.log(err))
}

class ProfileItems extends Component {

  static propTypes = {
    ...connectProfile.PropTypes
  };

  constructor(props){
      super(props);
      this.state = {
        detailsToggle: false,
        liveID: ''

      }
      profile = props.profile;
      apiCallUrl = '/api/items?userid=' + profile.identities[0].user_id;
    }

  render(){
    return(
      <div>
      <h1>My Items</h1>
        <div className="itemContainer">
          {profileItems.map ((item, index) => {
              let url = `/profile/myItems/${item.itemid}`
              return (
                <div key={index} className="itemDiv" id="itemDiv">
                  <img className="itemImg" src={item.itemimageurl} id='itemImg'/>
                  <div className="itemBasicInfo" id="itemBasicInfo">
                    <p className="profileItemName">{item.itemname}</p>
                    <p className="profileItemCatagory">{item.itemcatagory}</p>
                    <Button color='teal' > <Link to={url}>Get Details</Link> </Button>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  componentDidMount(){
    getProfileItems().then((r) => profileItems = r)
  }

}

export default connectProfile(ProfileItems);
