const express = require('express');
const bodyParser = require('body-parser');



var {mongoose} = require('./db/mongoose');

var {User} = require('./models/user');

var {Todo} = require('./models/Todo');

var app = express();

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

app.listen(3000,()=>{
  console.log('App is up on port 3000');
});
