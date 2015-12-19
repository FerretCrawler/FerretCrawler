var events = require('events')
var eventEmitter = new events.EventEmitter();
var db, collection;
var DB_NAME = "crawler_db";
var DS = ".";
var COLLECTION_NAME;

var safeInsertHandler = function(obj) {
    obj.lastChangedDate = Date.now();
    COLLECTION_NAME = obj.table;
    eventEmitter.emit('checkCollectionExists', obj);
  }
  // Bind the connection event with the handler
eventEmitter.on('safeInsert', safeInsertHandler);

var checkCollectionExistsHandler = function(obj) {
    var systemNamespace = db.collection('system.namespaces');
    db.listCollections({
      name: COLLECTION_NAME
    }).toArray(function(err, docs) {
      if (docs.length > 0) {
        // console.log("Collection " + DB_NAME + DS + COLLECTION_NAME + " exists ...");
        collection = db.collection(COLLECTION_NAME);
        eventEmitter.emit('insert', obj);
      } else {
        // console.log("Collection " + DB_NAME + DS + COLLECTION_NAME + " does not exists ...");
        eventEmitter.emit('createCollection', obj);
      }
    });
  }
  // Bind the connection event with the handler
eventEmitter.on('checkCollectionExists', checkCollectionExistsHandler);

var createCollectionHandler = function(obj) {
    //create collection
    db.createCollection(COLLECTION_NAME, function(err, coll) {
      if (err) throw err;

      console.log("Created collection " + COLLECTION_NAME);
      collection = coll;
      eventEmitter.emit("insert", obj);
    });
  }
  // Bind the connection event with the handler
eventEmitter.on('createCollection', createCollectionHandler);

var insertHandler = function(obj) {
    collection.updateOne({
      url: obj.url
    }, obj, {
      upsert: true
    }, function(err, results){
      if(err)
        console.log(err)
      if(results.result.nModified != 1) {
        console.log("Inserted item: " + obj.url);
      } else {
        console.log("Updated item: " + obj.url);
      }
    });
  }
  // Bind the connection event with the handler
eventEmitter.on('insert', insertHandler);

// create a schema
var Content = {
  insert: function(obj) {
    if (obj != null) {
      db = GLOBAL.db;
      eventEmitter.emit("safeInsert", obj);
    }
  }
}

// make this available to our users in our Node applications
module.exports = Content;
