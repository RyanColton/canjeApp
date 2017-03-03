import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Table, Header, Image, Button, Popup, Icon} from 'semantic-ui-react'
import {browserHistory} from 'react-router'
import './myOffers.css'

class MyOffers extends Component{
  static propTypes = {
    ...connectProfile.PropTypes
  };

  constructor(props){
    super(props)
    this.state = {
      offers:[],
      profile: props.profile
    }
    this.getOffers = this.getOffers.bind(this)
    this.deleteOffer = this.removeOffer.bind(this)
    this.offersSeen = this.offersSeen.bind(this)
  }
  getOffers = () => {
    return fetch(`/api/offers?userid=${this.state.profile.identities[0].user_id}`, {method: 'get'}).then((r)=>{
      console.log('pre json ', r)
      return r.json()

    }).then((response)=>{

      console.log('post json ', response)
      return this.setState({offers: response})

    }).catch((err)=>console.log(err))
  }
  removeOffer = (id) => {
    return fetch(`/api/offers/delete?offerid=${id}`, {method:'delete'})
  }
  offersSeen = (id) => {
    return fetch(`/api/offers?userid=${id}`, {method: 'put'})
  }
  render(){
    console.log(this.state.profile.identities[0].user_id)
    return(
      <div className="offersContainerDiv">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>User</Table.HeaderCell>
              <Table.HeaderCell>Offer</Table.HeaderCell>
              <Table.HeaderCell>For</Table.HeaderCell>
              <Table.HeaderCell>Contact</Table.HeaderCell>
              <Table.HeaderCell>Reject</Table.HeaderCell>
            </Table.Row>
         </Table.Header>
         <Table.Body>
          {this.state.offers.map((item, index) => {
            return(
              <Table.Row>
          <Table.Cell width="three wide">
            <Header as='h4' image>
              <Image src={item.userimage} shape='circular' size='mini'/>
              <Header.Content>
                {item.userfirstname}
                <Header.Subheader>{item.location}</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>
            <Header as='h5' image>
              <Image src={item.offeritemimage} shape='rounded' size='mini' />
              <Header.Content className="offersTextAttr" onClick={()=>browserHistory.push(`/public/itemDetails/profile/${item.userofferingid}/item/${item.itemofferedid}`)}>
                {item.offeritemname}
                <br/>
                <Header.Subheader className="orange">{item.offeritemcatagory}</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>
            <Header as='h5' image>
              <Image src={item.wanteditemimage} shape='rounded' size='mini' />
              <Header.Content className="offersTextAttr" onClick={()=>browserHistory.push(`/public/itemDetails/profile/${item.userofferedtoid}/item/${item.itemwantedid}`)}>
                {item.wanteditemname}
                <Header.Subheader className="orange">{item.wanteditemcatagory}</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>
            <Popup
              trigger={<Button color="teal" icon="comments" labelPosition="right" content="Contact"/>}
              content={<div>
                        <p><strong>Text: </strong>{item.userphone}</p>
                        <p><strong>Email: </strong>{item.useremail}</p>
                      </div>}
              />
          </Table.Cell>
          <Table.Cell>
            <Button color='red' icon="delete" onClick={()=>{this.removeOffer(item.id).then(()=>this.forceUpdate())}}/>
          </Table.Cell>
        </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      </div>
    )
  }

  componentDidMount(){
  this.getOffers().then(this.offersSeen(this.state.profile.identities[0].user_id))
  }
}

export default connectProfile(MyOffers)
