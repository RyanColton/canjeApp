import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Table, Header, Image, Button} from 'semantic-ui-react'
import './myOffers.css'
let profile
let offers = []
class MyOffers extends Component{
  static propTypes = {
    ...connectProfile.PropTypes
  };

  constructor(props){
    super(props)
    this.state = {}
    profile = props.profile
    this.getOffers = this.getOffers.bind(this)
  }
  getOffers = () => {
    return fetch(`/api/offers?userid=${profile.identities[0].user_id}`, {method: 'get'}).then((r)=>r.json()).then((response)=>offers = response).catch((err)=>console.log(err))
  }
  render(){
    return(
      <div className="offersContainerDiv">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>User</Table.HeaderCell>
              <Table.HeaderCell>Offer</Table.HeaderCell>
              <Table.HeaderCell>For</Table.HeaderCell>
              <Table.HeaderCell>Contact</Table.HeaderCell>
            </Table.Row>
         </Table.Header>
         <Table.Body>
          {offers.map((item, index) => {
            return(
              <Table.Row>
          <Table.Cell width="four wide">
            <Header as='h4' image>
              <Image src={item.userImage} shape='circular' size='mini' />
              <Header.Content>
                {item.userFirstName}
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>
            <Header as='h5' image>
              <Image src={item.offeritemimage} shape='rounded' size='mini' />
              <Header.Content>
                {item.offeritemname}
                <Header.Subheader>{item.offeritemcatagory}</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>
            <Header as='h5' image>
              <Image src={item.wanteditemimage} shape='circular' size='mini' />
              <Header.Content>
                {item.wanteditemname}
                <Header.Subheader>{item.wanteditemcatagory}</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>
            <Button>Contact</Button>
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
  this.getOffers().then(()=>console.log(offers))
  }
}

export default connectProfile(MyOffers)
