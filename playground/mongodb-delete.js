const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',
(error, db)=>{
  if(error){
   return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to the server of mongodb');

  var Todos = db.collection('Todos');

  var Users = db.collection('Users');

  Users.deleteMany({name: 'Misha'}).then((res) => {
    console.log(res);
  });

  // .then(result => {
  //   console.log(result);
  // }).catch(error => {
  //   console.log(error);
  // });

  Users.findOneAndDelete({_id: new ObjectID('5b434ff04f810709c0d0ca0a')}).then(result => console.log(result));

//  db.close();
});
