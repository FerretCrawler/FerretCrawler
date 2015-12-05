var events = require('events')
var eventEmitter = new events.EventEmitter();
var linkEventHandler = require('.././models/linkEventHandler')

// create a schema
var Link = {
  // createCollection: function(req, res, next){
  //
  // },
  //
  // checkCollectionExists: function(req, res, next){
  //   var db = req.db;
  //   var sys = db.get('system.namespaces');
  //   sys.find({name: 'foody_hcm.gcm'}, function(err, docs) {
  //     if(docs.length > 0) {
  //       res.locals.collection_exists = true;
  //     } else {
  //       res.locals.collection_exists = false;
  //     }
  //     next();
  //   });
  // },
  //
  // checkDocumentExists: function(collection, objToSave){
  //   collection.find({url: objToSave.url}, function(err, docs) {
  //     if(docs.length > 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //     next();
  //   });
  // },

  save: function(req, res, next, objToSave) {
    eventEmitter.emit("checkCollectionExists");
  }
}

// make this available to our users in our Node applications
module.exports = Link;
