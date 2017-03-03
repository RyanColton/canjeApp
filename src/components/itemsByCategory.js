import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Image, Button} from 'semantic-ui-react'
import {browserHistory} from 'react-router'
import SearchInput, {createFilter} from 'react-search-input'
import './Home.css';

const KEYS_TO_FILTERS = ['itemname', 'itemdescription']

class ItemByCatagory extends Component {
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
    this.getItems = this.getItems.bind(this)
    this.searchUpdated = this.searchUpdated.bind(this)
    }
  searchUpdated(term) {
      this.setState({searchTerm: term})
  }
  getItems = (param) => {
    return fetch(`/api/items?category=${param}`, {method: 'get'}).then((response) => response.json()).catch((err) => console.log(err))
  }
  componentDidMount(){
      this.getItems(this.props.params.category).then((response) => {
        this.setState({items: response})
      })
  }

  render() {
    const filteredItems = this.state.items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      <div className="Home">
         <div className="Home-TitleContainer">
           <div className="EditProfile-heading">{this.props.params.category}</div>
            <SearchInput className="search-input" onChange={this.searchUpdated} />
          </div>
          <div className="Home-intro">
            {filteredItems.map ((item, index) => {
                  let url = `/public/itemDetails/profile/${item.userid}/item/${item.itemid}`
                  return (
                    <div className="allItemContainer" id={index}>
                      <div className='allItemBox'>
                      <img className="allItemImg" src={item.itemimageurl} alt="Image"/>
                        <div className="allItemInfo">
                          <Image shape="circular" src={item.thumbnail} alt="User"/>
                          <div className="allItemText">
                          <p className="allItemName">{item.itemname}</p>
                          <div className="separator"></div>
                          <p className="allItemCatagory orange">{item.itemcatagory}</p>
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
