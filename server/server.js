const config = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

const _ = require('lodash');
var {mongoose} = require('./db/mongoose');

var {User} = require('./models/user');

var {Todo} = require('./models/todo');

var {authenticate} = require('./middleware/authenticate');



var app = express();
var port = process.env.PORT;
var getErrorObejct = (text)=>{
  return {errorText: text};
};

app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => {


  var todo = new Todo(
    {
      text: req.body.text,
      _creator: req.user._id
    }
  );

  todo.save().then((todo)=>{
    console.log('A todo HAS BEEN SAVED! Here it is: ',todo);
    res.send(todo);
//  res.send({resp: 'Succ'});
  }).catch((e)=>{

    console.log('An error occured while saving a todo: ', e);
    res.status(400).send(e);
  });


});

app.get('/todos', authenticate,(req, res)=>{

  Todo.find({
    _creator: req.user._id
  }).then((todos)=>{
    console.log('Here are all of the todos: ', todos);
    res.send({todos});
  }).catch((e)=>{
    console.log('An error occured: ',e);
    res.status(400).send(e);
  });
});

app.get('/todos/:TodoId',authenticate,(req, res)=>{
  var todoID = req.params.TodoId;
//res.send(req.params.TodoId);
    if(!ObjectID.isValid(todoID)) return res.status(404).send(getErrorObejct('Id of the Todo is invalid.'));

  Todo.findOne({
    _id: todoID,
    _creator: req.user._id
  }).then((todo)=>{
    if(!todo) return res.status(404).send(getErrorObejct('Todo with this ID doesn\'t exist'));
    res.status(200).send(todo);
  })
  .catch((e)=>{
    res.status(400).send({errorText: 'An error occured: ',e});
  });

});


app.delete('/todos/:_id',authenticate ,(req,res)=>{

  var {_id} = req.params;
//console.log('The ID IS::: ', _id);
  if(!ObjectID.isValid(_id)) return res.status(404).send(getErrorObejct('The ID of a todo is incorrect'));

  Todo.findOneAndRemove({
    _id: _id,
    _creator: req.user._id
  }).then((todo)=>{
    if(!todo) return res.status(404).send(getErrorObejct('No Todo with this ID was found'));

    res.status(200).send({todo});
  })
  .catch((e)=>{
    res.status(400).send(getErrorObejct(e));
  });

});

app.patch('/todos/:_id',authenticate,(req,res)=>{

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
    Todo.findOneAndUpdate({_id,_creator: req.user._id},{
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


//Users app requests start here



app.post('/users',(request,res)=>{

  var user = new User(_.pick(request.body,['email','password']));

  user.save().then((user)=>{
    // console.log('A user HAS BEEN SAVED! Here it is: ',user);
    // res.send(user);
    return user.generateAuthToken();
//  res.send({resp: 'Succ'});
}).then((token)=>{
    res.header('x-auth',token).send(user);
}).catch((e)=>{

    console.log('An error occured while saving a user: ', e);
    res.status(400).send(e);
  });


});


app.get('/users/me', authenticate,(req,res)=>{
  res.send(req.user);
});

app.post('/users/login',(req, res)=>{
  var body = _.pick(req.body,['email','password']);
  // var email = req.body.email;
  // var password = req.body.password;
  User.findByCredentials(body.email,body.password)
  .then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);

    });

  })
  .catch((e)=>{
    res.status(400).send('No such user found');
  });
  //res.send(body);
});

app.delete('/users/me/token', authenticate, (req,res)=>{
  req.user.removeToken(req.token)
  .then(()=>{
    res.status(200).send();
  })
  .catch((e)=>{
    res.status(400).send();
  });
});

app.listen(port,()=>{
  console.log(`App is up on port ${port}`);
});

module.exports = {app};
