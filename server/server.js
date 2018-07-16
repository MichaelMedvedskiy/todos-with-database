const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');

var {User} = require('./models/user');

var {Todo} = require('./models/Todo');

var app = express();

var getErrorObejct = (text)=>{
  return {errorText: text};
};

app.use(bodyParser.json());

app.post('/todos', (req,res) => {

  var todo = new Todo(req.body);

  todo.save().then((todo)=>{
    console.log('A todo HAS BEEN SAVED! Here it is: ',todo);
    res.send(todo);
//  res.send({resp: 'Succ'});
  }).catch((e)=>{

    console.log('An error occured while saving a todo: ', e);
    res.status(400).send(e);
  });


});

app.get('/todos',(req, res)=>{

  Todo.find({}).then((todos)=>{
    console.log('Here are all of the todos: ', todos);
    res.send({todos});
  }).catch((e)=>{
    console.log('An error occured: ',e);
    res.status(400).send(e);
  });
});

app.get('/todos/:TodoId',(req, res)=>{
  var todoID = req.params.TodoId;
//res.send(req.params.TodoId);
    if(!ObjectID.isValid(todoID)) return res.status(404).send(getErrorObejct('Id of the Todo is invalid.'));

  Todo.findById(todoID).then((todo)=>{
    if(!todo) return res.status(404).send(getErrorObejct('Todo with this ID doesn\'t exist'));
    res.status(200).send(todo);
  })
  .catch((e)=>{
    res.status(400).send({errorText: 'An error occured: ',e});
  });

});

app.listen(3000,()=>{
  console.log('App is up on port 3000');
});

module.exports = {app};
