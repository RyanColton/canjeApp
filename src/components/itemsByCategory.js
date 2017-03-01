import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Image, Button} from 'semantic-ui-react'
import {Link, browserHistory} from 'react-router'
import './Home.css';

const getItems = function(param){
  return fetch(`/api/items?category=${param}`, {method: 'get'}).then((response) => response.json()).catch((err) => console.log(err))
}
/* <p className="itemCatagory">{item.itemcatagory}</p> */
class ItemByCatagory extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  constructor(props){
    super(props);
    this.state = {
      items: []
     }
    }
  componentDidMount(){
      getItems(this.props.params.category).then((response) => {
        this.setState({items: response})
        console.log(this.state.items)
      })
  }

  render() {
    return (
      <div className="Home">
        <div  className="allItemTitle"><h1>{this.props.params.category}</h1></div>
        <div className="Home-intro">
          {this.state.items.map ((item, index) => {
                let url = `/public/itemDetails/profile/${item.userid}/item/${item.itemid}`
                return (
                  <div className="allItemContainer" id={index}>
                    <div className='allItemBox'>
                    <img className="allItemImg" src={item.itemimageurl}/>
                      <div className="allItemInfo">
                        <Image shape="circular" src={item.thumbnail}/>
                        <div className="allItemText">
                        <p className="allItemName">{item.itemname}</p>
                        <div className="separator"></div>
                        <p className="allItemCatagory">{item.itemcatagory}</p>
                        </div>
                        <Button color="teal" size="tiny" onClick={()=>browserHistory.push(url)}>Details</Button>
                      </div>
                    </div>
                    <br/>
                  </div>
                )
              })}
        </div>
      </div>
    );
  }

}

export default connectProfile(ItemByCatagory);
