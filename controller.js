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
 }

}
