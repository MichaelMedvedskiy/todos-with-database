const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',
(error, db)=>{
  if(error){
   return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to the server of mongodb');

  var Todos = db.collection('Todos');

  var Users = db.collection('Users');

//   Todos.findOneAndUpdate({_id:new ObjectID('5b434b0a27f93a4d5c5f8c72')},
//   {
//     $set: {
//       completed: false,
//       fieldADD: true
//     }
//   },
//   {
//     returnOriginal: false
//   }
// ).then((retRes)=>{
//   console.log('The changes have been made! Here is the new TODO: ', retRes);
// })
// .catch((err)=>{
//   console.log(err);
// });

Users.findOneAndUpdate({
  _id : new ObjectID('5b44725f8aa14f24485c7477')
},
{
  $set: {
    location: 'USA'
  },
  $inc: {
    age:1
  }

},
{
  returnOriginal: false
}).then((modifiedDoc)=>{
  console.log('Here is the updated version of my profile: ', modifiedDoc);
});

//  db.close();


});
