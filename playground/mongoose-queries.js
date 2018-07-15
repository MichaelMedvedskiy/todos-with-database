const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb');


var _id = "5b4855ef7fe1431018d5ee944";

if(!ObjectID.isValid(_id)) return console.log('The user id was wrong');

User.findById(_id).then((user)=>{
  if(user === null){
    return console.log('No user with this ID was found.');
  }
  console.log('User: ', user);
})
.catch((e)=>{
  console.log('An error occured: ', e);
});

// Todo.find({_id})
// .then((todos)=>{
//   ;console.log('Here are the todos: ',todos);
// });
//
// Todo.findOne({_id}).then((todos)=>{
//   console.log('Here is the TODOS : ',todos);
// });
