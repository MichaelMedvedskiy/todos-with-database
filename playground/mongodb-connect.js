const {MongoClient, ObjectID} = require('mongodb');

//obj id test

//var obj = new ObjectID();
//console.log(new ObjectID());
MongoClient.connect('mongodb://localhost:27017/TodoApp',
(error, db)=>{
  if(error){
   return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to the server of mongodb');

  var Todos = db.collection('Todos');

  var Users = db.collection('Users');

  // Todos.insertOne({
  //   text: 'bake meat',
  //   completed: true
  // },(err, result)=>{
  //   if(err){
  //     return console.log('Error inserting document in collection Todos. Here is the error gotten: ',err);
  //   }
  //   console.log('Insert successful! Inserted:');
  //   console.log(JSON.stringify(result.ops,undefined,2 ));
  // });

  // Users.insertOne({
  //   name: 'Misha',
  //   age: '19',
  //   location: 'Russia'
  // },(error, result)=>{
  //   if(error){
  //     return console.log('Error adding document to users: ', error);
  //   }
  //   console.log('Success! Here is what\'s been added: ', JSON.stringify(result.ops,undefined,2));
  //   console.log('The time this has been produced at is: ', result.ops[0]._id.getTimestamp());
  // });


  Users.find({name:{ '$ne':'Misha'}}).toArray().then(
    (docs)=>{
      console.log('Here are that many Users found: ',docs.length);
      console.log(docs);
    }).catch((error)=>{
      console.log('Unabe to fetch args: ',error);
    });


  // Todos.find().count().then(
  //   (amount)=>{
  //     console.log('There are that many todos in total: ',amount);
  //   }
  // ).catch((err)=>{
  //   console.log(err);
  // });

  db.close();
});
