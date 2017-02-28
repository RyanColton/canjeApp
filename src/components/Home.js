import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Image, Button} from 'semantic-ui-react'
import {Link} from 'react-router'
import './Home.css';

const getItems = function(){
  return fetch('/api/items', {method: 'get'}).then((response) => response.json()).catch((err) => console.log(err))
}
/* <p className="itemCatagory">{item.itemcatagory}</p> */
class Home extends Component {
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
      getItems().then((response) => {
        this.setState({items: response})
      })
  }

  render() {
    return (
      <div className="Home">
        <div className="Home-intro">
          <h2>CANJE: All</h2>
          {
              this.state.items.map ((item, index) => {
                let url = `/public/itemDetails/profile/${item.userid}/item/${item.itemid}`
                return (
                  <div className="allItemContainer">
                    <div className='allItemBox'>
                    <img className="allItemImg" src={item.itemimageurl}/>
                      <div className="allItemInfo">
                        <Image shape="circular" src={item.thumbnail}/>
                        <div className="itemText">
                        <p className="allItemName">{item.itemname}</p>
                        <div className="separator"></div>
                        <p className="allItemCatagory">{item.itemcatagory}</p>
                        </div>
                        <Button color="teal" size="tiny"><Link to={url}>Details</Link></Button>
                      </div>
                    </div>
                    <br/>
                  </div>
                )
              })
            }

        </div>
      </div>
    );
  }

}

export default connectProfile(Home);
