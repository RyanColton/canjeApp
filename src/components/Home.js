import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Image, Button} from 'semantic-ui-react'
import {Link, browserHistory} from 'react-router'
import SearchInput, {createFilter} from 'react-search-input'
import './Home.css';

const getItems = function(){
  return fetch('/api/items', {method: 'get'}).then((response) => response.json()).catch((err) => console.log(err))
}

const KEYS_TO_FILTERS = ['itemname', 'itemdescription']
/* <p className="itemCatagory">{item.itemcatagory}</p> */
class Home extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  constructor(props){
    super(props);
    this.state = {
      items: [{
        itemname: 'Loading',
        itemdescription: 'Loading'
      }],
      searchTerm: ''
     }
     this.searchUpdated = this.searchUpdated.bind(this)
    }
  // getInitialState () {
  //   return { searchTerm: '' }
  // }
  componentDidMount(){
      getItems().then((response) => {
        this.setState({items: response})
      })
  }

  render() {
    const filteredItems = this.state.items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      <div className="Home">
        <div className="Home-TitleContainer">
          <div  className="allItemTitle"><h1>All</h1></div>
           <SearchInput className="search-input" onChange={this.searchUpdated} />
         </div>
        <div className="Home-intro">
          {filteredItems.map ((item, index) => {
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
  searchUpdated (term) {
    this.setState({searchTerm: term})
  }


}

export default connectProfile(Home);
