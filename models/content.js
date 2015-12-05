var events = require('events')
var eventEmitter = new events.EventEmitter();
var db, objToSave, collection;
var DB_NAME = "crawler_db";
var DS = ".";
var COLLECTION_NAME;

var safeInsertHandler = function(){
  console.log("Safe insert ...");
  eventEmitter.emit('checkCollectionExists');
}
// Bind the connection event with the handler
eventEmitter.on('safeInsert', safeInsertHandler);

var checkCollectionExistsHandler = function(){
  var systemNamespace = db.collection('system.namespaces');
  db.listCollections({name: COLLECTION_NAME}).toArray(function(err, docs) {
    if(docs.length > 0) {
      console.log("Collection " + DB_NAME + DS + COLLECTION_NAME + " exists ...");
      collection = db.collection(COLLECTION_NAME);
      eventEmitter.emit('insert');
    } else {
      console.log("Collection " + DB_NAME + DS + COLLECTION_NAME + " does not exists ...");
      eventEmitter.emit('createCollection');
    }
  });
}
// Bind the connection event with the handler
eventEmitter.on('checkCollectionExists', checkCollectionExistsHandler);

var createCollectionHandler = function(){
  console.log("Create collection " + COLLECTION_NAME);
  //create collection
	db.createCollection(COLLECTION_NAME, function(err, coll){
    if (err) throw err;

   	console.log("Created collection " + COLLECTION_NAME);
    collection = coll;
    eventEmitter.emit("insert");
  });
}
// Bind the connection event with the handler
eventEmitter.on('createCollection', createCollectionHandler);

var insertHandler = function(){
  console.log("Insert ...");
  collection.updateOne({}, objToSave, {upsert : true});
}
// Bind the connection event with the handler
eventEmitter.on('insert', insertHandler);

// create a schema
var Content = {
  insert: function(req, res, next, obj) {
    db = req.db;
    objToSave = obj;
    COLLECTION_NAME = objToSave.name;
    eventEmitter.emit("safeInsert");
  }
}

// make this available to our users in our Node applications
module.exports = Content;
