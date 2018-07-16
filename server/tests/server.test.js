const expect = require('expect');
const supertest = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const {ObjectID} = require('mongodb');
// beforeEach((done)=>{
//   Todo.remove({}).then(()=>{done();});
//   //console.log(123);
//   //done();
// });
// describe('Dont post an incorrect TODO', ()=>{
//
//
//   it('Should add then todo for good',(done)=>{
//     var text = 'dick pick to feminist publics';
//
//     supertest(app)
//     .post('/todos')
//     .send({text})
//     .expect(200)
//     .expect((response)=>{
//       expect(response.body.text).toBe(text+'');
//     })
//     .end((err, res)=>{
//       console.log('------------------------------');
//       if(err){
//         return done(err);
//       }
//
//       Todo.find({text}).then((todos)=>{
//         expect(todos.length).toBe(1);
//         done();
//       }).catch((err)=>{return done(err)});
//     });
//
//
//   });
//
//   it('Should cancel the bad request todo',(done)=>{
//     var text = '            JO           ';
//     supertest(app)
//     .post('/todos')
//     .send({text})
//     .expect(400)
//     .end((err,res)=>{
//       if(err) return done(err);
//         Todo.find({}).then((todos)=>{
//           expect(todos.length).toBe(0);
//           done();
//         }).catch((err)=>{done(err);});
//     });
//   });
// });

// describe('Testing the GET /todos route',()=>{
//
//   it('Should accept the GET/todos request', (done)=>{
//     supertest(app)
//     .get('/todos')
//     .expect(200)
//     .expect((res)=>{
//     //  console.log(res);
//       expect(res.body.todos.length).toBeGreaterThan(0);
//
//     }).end((err, response)=>{
//       if(err) return done(err);
//       Todo.find().then((todos)=>{
//         console.log(
//           JSON.stringify(response.body.todos,undefined, 2));
//           console.log(
//             JSON.stringify(todos,undefined, 2));
//       // expect(response.body.todos).toBe(todos);
//         done();
//       }).catch((e)=>{
//         return done(e);
//       });
//
//     });
//   });
//
//
//
// });


describe('Testing solo finds by id',()=>{
it('Should find a todo by id normaly', (done)=>{

  supertest(app)
  .get('/todos/5b4a10aea9ada88414e29b9d')
  .expect(200)
  .end((e, res)=>{
    if(e) return done(e);
    Todo.findById('5b4a10aea9ada88414e29b9d').then((todo)=>{
    //  res.body._id = new ObjectID(res.body._id);
      console.log(res.body);
      console.log('----------');
      console.log(todo);
      expect(res.body._id).toEqual(todo._id);
      done();

    }).catch((e)=>{
          done(e);
    });
    });

});

it('Should return 404 for an incorrect request',(done)=>{
  console.log(`/todos/${(new ObjectID)}`);
  console.log(`/todos/${(new ObjectID)}`);
  console.log(`/todos/${(new ObjectID).toHexString()}`);
  supertest(app)
  .get(`/todos/${(new ObjectID).toHexString()}`)
  .expect(404)
  .end((e,res)=>{
    if(e) return done(e);
    done();
  });
});

it('Should return 404 for an incorrect todo ID',(done)=>{
  supertest(app)
  .get('/todos/JopaNegra')
  .expect(404)
  .end((e,res)=>{
    if(e) return done(e);
    done();
  });
});

});
