import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Button, Image} from 'semantic-ui-react';
import {Link} from 'react-router'
import "./publicItemDetails.css"

let item = {}
let url = ''


class PublicItemDetails extends Component {
  constructor(){
    super()
    this.getItemDetails = this.getItemDetails.bind(this)
  }

  getItemDetails = (id) => {
    return fetch(`/api/profile/item?itemid=${id}`, {medthod: 'get'}).then((response)=>response.json()).catch((err)=>console.log(err))
  }

  render(){
    return(
      <div className="itemDetailedContainer">
        <img className="itemDetailedImage" src={item.itemimageurl} />
        <br/>
        <Image src={item.thumbnail} shape="circular"/><h1>{item.itemname}</h1>
        <div className="itemDetailedInfo">

          <p><strong>Description: </strong></p>
          <p> &nbsp; &nbsp; {item.itemdescription}</p>
          <p><strong>Catagory: </strong>{item.itemcatagory}</p>
        </div>
        <br/>
        <br/>
        <div className="itemDetailedButtons">
          <Button color='teal'><Link to={url}>Make Offer</Link></Button>
        </div>
      </div>
    )
  }

  componentDidMount(){
    this.getItemDetails(this.props.params.item).then((r)=>{
      item = r[0]
      url = `/profile/makeOffer/profile/${this.props.params.userid}/item/${this.props.params.item}`
      console.log(item)
    })
  }
}

export default connectProfile(PublicItemDetails)
