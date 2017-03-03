import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {browserHistory} from 'react-router'
import {Button, Image, Label, Header, Container, Divider, Popup} from 'semantic-ui-react';
import "./profileItemDetails.css"


class ProfileItemDetails extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAvailable: null,
      item: {
        itemname: 'Loading'
      }
    }

    this.markAsUnavalible = this.markAsUnavalible.bind(this)
    this.getItemDetails = this.getItemDetails.bind(this)
    this.deleteItem = this.deleteItem.bind(this)

  }

  getItemDetails = (parameter) => {
    return fetch(`/api/profile/item?itemid=${parameter}`, {method: 'get'}).then((r) => r.json()).catch((err) => console.log(err))
  }

  markAsUnavalible(param, setState) {
    fetch(`/api/profile/toggleItemAvalibility?itemid=${param}`, {method: 'put'})
    this.setState({isAvailable: !this.state.isAvailable})
    console.log(this.state.isAvailable)
    return
  }
  deleteItem = (param) => {
    return fetch(`/api/profile/item?itemid=${param}`, {method: 'delete'})
  }

  render(){
    console.log("on mount ", this.state.isAvailable)
    return(
      <div className="PublicItemDetail-container">
        <Image className="PublicItemDetail-image" shape="rounded" src={this.state.item.itemimageurl} />
        <br/>
        <div className="PublicItemDetail-info">
          <Header onClick={()=>browserHistory.push(`/public/profile/${this.state.item.userid}`)} as='h1'>
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

          <Button color='teal' size="large" icon='check circle' labelPosition='right' onClick={()=>{this.markAsUnavalible(this.state.item.itemid, this.setState)}} content={this.state.isAvailable ? 'Mark as Sold' : 'Mark as Available'} />
          <Popup
            trigger={<Button color='red' icon='delete' labelPosition='right' content='Delete' />}
            content={<Button color='red' size='large' onClick={()=>{this.deleteItem(this.state.item.itemid).then(()=>browserHistory.push('/profile/myItems'))}}>Confirm Deletion</Button>}
            on='click'
            />
        </div>
      </div>
    </div>
    )
  }

  componentDidMount(){
    this.getItemDetails(this.props.params.item).then((r) => {
      this.state.item = r[0]
      this.setState({isAvailable: r[0].available})
      console.log(this.state.item)
  })

  }


}

export default connectProfile(ProfileItemDetails);
