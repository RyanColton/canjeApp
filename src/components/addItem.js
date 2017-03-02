import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import {Button, Dropdown, Divider, Input, Label, TextArea} from 'semantic-ui-react';
import {connectProfile} from '../auth';
import FineUploaderS3 from 'fine-uploader-wrappers/s3'
import Gallery from 'react-fine-uploader'
import config from './../config'
import 'react-fine-uploader/gallery/gallery.css'
import './addItem.css'

const uploader = new FineUploaderS3({
  options: {
    chunking: {
      enabled: false
    },
    request: {
      endpoint: 'https://canje.s3.amazonaws.com',
      accessKey: config.accessKey
    },
    cors: {
       //all requests are expected to be cross-domain requests
       expected: true,
   },
    retry: {
      enableAuto: true
    },
    signature:{
      endpoint: '/s3handler'
    },
    uploadSuccess:{
      endpoint: '/s3handler?success=true'
    }
  }
})

const addItemToDB = (data) => {
     return fetch('/api/profile/addItem', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data
      })
  }
let profile = ''



class addItem extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };
  recordSelection = (data) => {
    this.setState({selectedCatagory: data})
  }
  constructor(props){
      super(props);
      profile = props.profile;
      this.state = {
        catagories: [
          {
            key: 'Kitchen',
            value:'Kitchen',
            flag: 'Kitchen',
            text: 'Kitchen'
          },
          {
            key: 'Bathroom',
            value:'Bathroom',
            flag: 'Bathroom',
            text: 'Bathroom'
          },
          {
            key: 'Living Room',
            value:'LivingRoom',
            flag: 'Living Room',
            text: 'Living Room'
          },
          {
            key: 'Outdoors',
            value:'Outdoors',
            flag: 'Outdoors',
            text: 'Outdoors'
          },
          {
            key: 'Misc',
            value:'Misc',
            flag: 'Misc',
            text: 'Misc'
          }

        ],
        selectedCatagory: '',
        item: {
          userID: profile.identities[0].user_id,
          },
        error: null,
        saved: false,
        saving: false
        }
      this.recordSelection = this.recordSelection.bind(this)

    }


  render() {
    return (
      <div className="addItemContainer">
        <div className="AddItem-heading">Add a New Item</div>
        <Divider />
        <div className="AddItem-inputContainer">
          <div className="AddItem-imageInput">
            <Label className="EditProfile-locationLabel" htmlFor="Name" content="Image" size='big'/>
            <Gallery uploader={uploader} />
          </div>
          <div className="AddItem-DataInput">
            <form className="EditProfile-form" onSubmit={this.onSubmit} onChange={this.onClearSaved}>
              <fieldset className="EditProfile-fieldset" disabled={this.state.saving}>
                <div>
                  <div className="AddItem-textFieldInput">
                    <Label className="EditProfile-locationLabel" htmlFor="Name" content="Name" size='big'/>
                    <Input
                      onChange={(e)=>this.nameInput = e.target.value}
                      id="name"
                      type="text"
                      placeholder="Name of Product"
                      defaultValue={this.state.item.name}
                    />
                  </div>
                    <Divider />
                  <div className="AddItem-textFieldInput">
                    <Label className="EditProfile-locationLabel" htmlFor="Category" content="Category" size='big' />
                    <Dropdown
                      ref={(ref) => this.catagoryInput = ref}
                      onChange={(event, value)=>{this.recordSelection(value.value)}}
                      options={this.state.catagories}
                      id="catagory"
                      placeholder="Select a Category"
                      defaultValue={this.state.item.catagory}
                      selection
                    />
                </div>
                </div>
                <Divider />
                <Label className="EditProfile-locationLabel" htmlFor="description" content="Description" size='big' />
                 <TextArea
                   onChange={(e)=>this.descriptionInput = e.target.value}
                   className="EditProfile-PersonalBioInput"
                   id="Description"
                   type="text"
                   placeholder="Description of the item."
                   defaultValue={this.state.item.description}
                 />
                <div className="EditProfile-formControls">
                  <Button color='teal' className="EditProfile-submitButton" type="submit">
                    {this.state.saving ? 'Adding' : 'Add Item'}
                  </Button>
                  {this.state.saved && (
                    <div className="EditProfile-saved">Item Uploaded</div>
                  )}
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>

    )
  };

  onSubmit = (event) => {
    event.preventDefault();
    let item = this.state.item
    item.name = this.nameInput
    item.category = this.state.selectedCatagory
    item.description = this.descriptionInput
    this.setState({
      saving: true,
      item: item
    }, async () => {
      this.setState({saving: false});
    });
    const data = JSON.stringify(this.state.item)
    addItemToDB(data).then((response)=>{
      browserHistory.push("/")
    })

  };

  onClearSaved = (event) => {
    this.setState({saved: false});
    }

  componentDidMount(){
    this.setState({test: 'hello'}, async () => {
    console.log(this.state)
    })
  }
}
export default connectProfile(addItem)
