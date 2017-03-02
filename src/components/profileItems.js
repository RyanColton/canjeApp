import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Button} from 'semantic-ui-react'
import {Link, browserHistory} from 'react-router';
import './profileItems.css'

let apiCallUrl

class ProfileItems extends Component {

  static propTypes = {
    ...connectProfile.PropTypes
  };

  constructor(props){
      super(props);
      this.state = {
        detailsToggle: false,
        liveID: '',
        apiCallUrl: `/api/items?userid=${props.profile.identities[0].user_id}`,
        profileItems: [],
        profile: props.profile
      }
      this.getProfileItems = this.getProfileItems.bind(this)
    }
    getProfileItems = () => {
      return fetch(this.state.apiCallUrl, {method: 'get'}).then((response) => response.json()).catch((err) => console.log(err))
    }

  render(){
    return(
      <div className="ProfileItems-PageContainer">
      <div className="EditProfile-heading">My Items</div>
        <div className="itemContainer">
          {this.state.profileItems.map ((item, index) => {
              let url = `/profile/myItems/${item.itemid}`
              return (
                <div key={index} className="itemDiv" id="itemDiv">
                  <img className="itemImg" src={item.itemimageurl} id='itemImg' alt="Image"/>
                  <div className="itemBasicInfo" id="itemBasicInfo">
                    <p className="profileItemName">{item.itemname}</p>
                    <p className="profileItemCatagory">{item.itemcatagory}</p>
                    <Button color='teal' onClick={()=>browserHistory.push(url)} content="Get Details" />
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  componentDidMount(){
    this.getProfileItems().then((r) => this.setState({profileItems: r}))
  }

}

export default connectProfile(ProfileItems);
