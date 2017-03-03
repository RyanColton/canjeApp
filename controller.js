var app = require('./server')
var db = app.get('db');
module.exports = {
  addItem: function(req, res, next){
    // var itemimageurl = `https://s3-us-west-1.amazonaws.com/canje/${req.session.imageInfo.key}`
    console.log(req.session.imageInfo)
  //   db.add_item([req.body.userid, req.body.name, req.body.description, itemimageurl, req.body.catagory], function(err, item){
  //     console.log(err)
  //   res.status(200).send('Item Added')
  // })
  },
  getItems: function(req, res, next){
    if(req.query.userid){
      db.get_profile_items([req.query.userid], function(err, items){
        console.log(err)
        res.status(200).send(items)
      })
    }
    else if(req.query.category){
      db.get_category_items([req.query.category], function(err, items){
        console.log(err)
        res.status(200).send(items)
      })
    }

    else {db.get_items(function(err, items){
      console.log(err)
      res.status(200).send(items)
    })
   }
 },
 getItem: (req, res, next) => {
   db.get_item([req.query.itemid], (err, item) =>{
     console.log(err)
     res.status(200).send(item)
   })
 },
 deleteItem: (req, res, next) => {
   db.delete_item([req.query.itemid], (err, item)=>{
     console.log(err)
     res.status(200).send('Item ' + req.query.itemid + ' Deleted')
   })
 },
 toggleItemAvalibility: (req, res, next) => {
   db.toggle_avalibility([req.query.itemid], (err, item) => {
     console.log(err)
     res.status(200).send('Item ' + req.query.itemid + ' Updated')
   })
 },
 addOffer: (req, res, next) => {
   db.add_offer([req.body.itemofferedid, req.body.itemwantedid, req.body.userofferingid, req.body.userofferedtoid, req.body.timestamp], (err, item) => {
     res.status(200).send('Offer added')
   })
 },
 getOffers: (req, res, next) => {
   db.get_offers([req.query.userid], (err, offers) => {
     res.status(200).send(offers)
   })
 },
 profileExsists: (req, res, next) => {
   db.profile_exsists([req.query.userid], (err, response)=>{
     res.status(200).send(response)
   })
 },
 newUser: (req, res, next)=>{
   db.add_profile([req.body.userid, req.body.userImage, req.body.thumbnail, req.body.userFirstName, req.body.useremail, req.body.userphone, req.body.location, req.body.personalbio, req.body.itemswanted, req.body.username, req.body.userLastName], (err, profile)=>{
     console.log(err)
     res.status(200).send('User Added')
   })
 },
 updateUser: (req, res, next)=>{
   db.update_profile([req.body.userid, req.body.userImage, req.body.thumbnail, req.body.userFirstName, req.body.useremail, req.body.userphone, req.body.location, req.body.personalbio, req.body.itemswanted, req.body.username, req.body.userLastName], (err, profile)=>{
     console.log(err)
     res.status(200).send('User Updated')
   })
 },
 removeOffer: (req, res, next)=>{
   db.remove_offer([req.query.offerid], (err, response)=>{
     console.log(err)
     res.status(200).send('Offer Removed')
   })
 },
 getUser: (req, res, next)=>{
   db.get_user([req.query.userid], (err, user)=>{
     console.log(err)
     res.status(200).send(user)
   })
 },
 checkOffers: (req, res, next)=>{
   db.check_offer([req.query.userid], (err, statement)=>{
     console.log(err)
     res.status(200).send(statement)
   })
 },
 markAsSeen: (req, res, next)=>{
   db.mark_as_seen([req.query.userid], (err, statement)=>{
     console.log(err)
     res.status(200).send('Offers Updated')
   })
 }
}
