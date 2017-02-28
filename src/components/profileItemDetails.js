import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Link} from 'react-router'
import {Button, Popup} from 'semantic-ui-react';
import "./profileItemDetails.css"

let avalibility
let isAvailable

const getItemDetails = (parameter) => {
  return fetch(`/api/profile/item?itemid=${parameter}`, {method: 'get'}).then((r) => r.json()).catch((err) => console.log(err))
}


const deleteItem = (param) => {
  return fetch(`/api/profile/item?itemid=${param}`, {method: 'delete'})
}
let itemID
let item

class ProfileItemDetails extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAvailable: null
    }
    item = {
      itemname: 'Loading'
    }
    this.markAsUnavalible = this.markAsUnavalible.bind(this)

  }

  componentWillMount(){
  console.log("before mount ", this.state.isAvailable)
  }
  markAsUnavalible(param, setState) {
    fetch(`/api/profile/toggleItemAvalibility?itemid=${param}`, {method: 'put'})
    setState({isAvailable: !this.state.isAvailable})
    console.log(this.state.isAvailable)
    return
  }
  render(){
    console.log("on mount ", this.state.isAvailable)
    return(
      <div className="itemDetailedContainer">
        <img className="itemDetailedImage" src={item.itemimageurl} />
        <h1>{item.itemname}</h1>
        <div className="itemDetailedInfo">

          <p><strong>Description: </strong></p>
          <p> &nbsp; &nbsp; {item.itemdescription}</p>
          <p><strong>Catagory: </strong>{item.itemcatagory}</p>
        </div>
        <br/>
        <br/>
        <div className="itemDetailedButtons">
          <Button color='teal' size="large" icon='checkmark' labelPosition='right' onClick={()=>{this.markAsUnavalible(item.itemid, this.setState)}}>{this.state.isAvailable ? 'Mark as Sold' : 'Mark as Available'}</Button>
          <Popup
            trigger={<Button color='teal' size="large" icon='delete' labelPosition='right' content='Delete' />}
            content={<Button color='red' size='large' onClick={()=>{deleteItem(item.itemid)}}><Link to='/profile/myItems'>Confirm Deletion</Link></Button>}
            on='click'
            />
        </div>
      </div>
    )
  }

  componentDidMount(){
    getItemDetails(this.props.params.item).then((r) => {
      item = r[0]
      this.setState({isAvailable: r[0].available})
      console.log('after mount ', this.state.isAvailable)
  })

  }


}

export default connectProfile(ProfileItemDetails);
