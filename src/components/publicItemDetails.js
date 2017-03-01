import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Button, Image, Label, Header, Container, Divider} from 'semantic-ui-react';
import {Link, browserHistory} from 'react-router'
import "./publicItemDetails.css"

let item = {}
let url = ''


class PublicItemDetails extends Component {
  constructor(){
    super()
    this.getItemDetails = this.getItemDetails.bind(this)
  }

  getItemDetails = (id) => {
    return fetch(`/api/profile/item?itemid=${id}`, {method: 'get'}).then((response)=>response.json()).catch((err)=>console.log(err))
  }

  render(){
    return(
      <div className="PublicItemDetail-container">
        <Image className="PublicItemDetail-image" shape="rounded" src={item.itemimageurl} />
        <br/>
        <div className="PublicItemDetail-info">
          <Header onClick={()=>browserHistory.push(`/public/profile/${item.userid}`)} as='h1'>
            <Image src={item.userimage} shape="circular" size="tiny"/>
            {item.itemname}
            <Header.Subheader>
              {item.itemcatagory}
            </Header.Subheader>
          </Header>
          <Divider />
          <div className="itemDetailedInfo">
            <Container textAlign='left'>
              <Header as='h3'>Description</Header>
              <p> &nbsp; &nbsp; {item.itemdescription}</p>
            </Container>
          </div>
          <br/>
          <br/>
          <div className="itemDetailedButtons">
            <Button color='teal' onClick={()=>browserHistory.push(url)}>Make Offer</Button>
          </div>
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
