var events = require('events')
var eventEmitter = new events.EventEmitter();

var checkCollectionExistsHandler = function(){
  console.log("checkCollectionExists");
  eventEmitter.emit('checkDocumentExists');
}
// Bind the connection event with the handler
eventEmitter.on('checkCollectionExists', checkCollectionExistsHandler);

var createCollectionHandler = function(){
  console.log("createCollection");
}
// Bind the connection event with the handler
eventEmitter.on('createCollection', createCollectionHandler);

var checkDocumentExistsHandler = function(){
  console.log("checkDocumentExists");
}
// Bind the connection event with the handler
eventEmitter.on('checkDocumentExists', checkDocumentExistsHandler);
