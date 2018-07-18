const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

const _ = require('lodash');
var {mongoose} = require('./db/mongoose');

var {User} = require('./models/user');

var {Todo} = require('./models/todo');



var app = express();
var port = process.env.PORT || 3000;
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


app.delete('/todos/:_id',(req,res)=>{

  var {_id} = req.params;
//console.log('The ID IS::: ', _id);
  if(!ObjectID.isValid(_id)) return res.status(404).send(getErrorObejct('The ID of a todo is incorrect'));

  Todo.findByIdAndRemove(_id).then((todo)=>{
    if(!todo) return res.status(404).send(getErrorObejct('No Todo with this ID was found'));

    res.status(200).send({todo});
  })
  .catch((e)=>{
    res.status(400).send(getErrorObejct(e));
  });

});

app.patch('/todos/:_id',(req,res)=>{

  var {_id} = req.params;

  console.log('HERE IS _id ',_id);
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(_id)) return res.status(404).send(getErrorObejct('The ID of a todo is incorrect'));

    if( body.completed){
      body.completedAt = new Date().getTime();
    }else{
      body.completed = false;
      body.completedAt = null;
    }
    Todo.findByIdAndUpdate(_id,{
        $set: body
    },{
      new: true
    }).then((todo)=>{
      console.log(todo);
      if(!todo) return res.status(404).send(getErrorObejct('The TODO with this ID does not exist'));
      res.status(200).send({todo});
    }).catch((e)=>{
      res.status(400).send(e);
    });
});

app.listen(port,()=>{
  console.log(`App is up on port ${port}`);
});

module.exports = {app};
