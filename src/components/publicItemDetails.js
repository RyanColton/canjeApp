import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Button, Image, Label, Header, Container, Divider} from 'semantic-ui-react';
import {browserHistory} from 'react-router'
import "./publicItemDetails.css"


class PublicItemDetails extends Component {
  constructor(){
    super()
    this.state={
      item: {},
      url: ''
    }
    this.getItemDetails = this.getItemDetails.bind(this)
  }

  getItemDetails = (id) => {
    return fetch(`/api/profile/item?itemid=${id}`, {method: 'get'}).then((response)=>response.json()).catch((err)=>console.log(err))
  }

  render(){
    return(
      <div className="PublicItemDetail-container">
        <Image className="PublicItemDetail-image" shape="rounded" src={this.state.item.itemimageurl} />
        <br/>
        <div className="PublicItemDetail-info">
          <Header onClick={()=>browserHistory.push(`/public/profile/${this.state.item.userid}`)} as='h1'>
            <Image src={this.state.item.userimage} shape="circular" size="tiny"/>
            {this.state.item.itemname}
            <Header.Subheader>
              {this.state.item.itemcatagory}
            </Header.Subheader>
          </Header>
          <Divider />
          <div className="itemDetailedInfo">
            <Container textAlign='left'>
              <Header as='h3'>Description</Header>
              <p> &nbsp; &nbsp; {this.state.item.itemdescription}</p>
            </Container>
          </div>
          <br/>
          <br/>
          <div className="itemDetailedButtons">
            <Button color='teal' onClick={()=>browserHistory.push(this.state.url)}>Make Offer</Button>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount(){
    this.getItemDetails(this.props.params.item).then((r)=>{
      this.setState({
        item: r[0],
        url: `/profile/makeOffer/profile/${this.props.params.userid}/item/${this.props.params.item}`
      })

    })
  }
}

export default connectProfile(PublicItemDetails)
