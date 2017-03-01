import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {browserHistory} from 'react-router'
import {Button} from 'semantic-ui-react'
import './makeOffer.css'
let profile
let profileItems = []


class MakeOffer extends Component{
  static propTypes = {
    ...connectProfile.PropTypes
  };

  constructor(props){
    super(props)
    this.state = {
    }
    profile = props.profile
    this.getProfileItems = this.getProfileItems.bind(this)
    this.makeOffer = this.makeOffer.bind(this)
  }
  getProfileItems = (profile) => {
    return fetch(`/api/items?userid=${profile.identities[0].user_id}`, {method: 'get'}).then((r)=> r.json()).catch((err)=>console.log(err))
  }
  makeOffer = (info) => {
    let infoStr = JSON.stringify(info)
    return fetch('/api/offers', {
      method: 'POST',
      body: infoStr,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
  }
  render(){

    return(
      <div className='makeOfferContainer'>
        {profileItems.map ((item, index) => {
          let offerInfo = {
            itemofferedid: item.itemid,
            itemwantedid: parseInt(this.props.params.item),
            userofferingid: profile.identities[0].user_id,
            userofferedtoid: this.props.params.userid,
            timestamp: new Date()
          }
            return (
              <div key={index} className="offerItemDiv" id="itemDiv">
                <img className="itemImg" src={item.itemimageurl} id='itemImg'/>
                <div className="itemBasicInfo" id="itemBasicInfo">
                  <p className="profileItemName">{item.itemname}</p>
                  <Button color='teal' onClick={()=>{this.makeOffer(offerInfo).then((response)=>{browserHistory.push('/')})}} content="Offer Item" icon='checkmark'/>
                </div>
              </div>
            )
          })}
      </div>
    )
  }
  componentDidMount(){
    this.getProfileItems(profile).then((r)=> profileItems = r).then(()=>console.log(profileItems))
  }
}

export default connectProfile(MakeOffer)
