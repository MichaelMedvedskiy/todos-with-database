const expect = require('expect');
const supertest = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
beforeEach((done)=>{
  Todo.remove({}).then(()=>{done();});
  //console.log(123);
  //done();
});
describe('Dont post an incorrect TODO', ()=>{


  it('Should add then todo for good',(done)=>{
    var text = 'dick pick to feminist publics';

    supertest(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((response)=>{
      expect(response.body.text).toBe(text+'');
    })
    .end((err, res)=>{
      console.log('------------------------------');
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        done();
      }).catch((err)=>{return done(err)});
    });


  });

  it('Should cancel the bad request todo',(done)=>{
    var text = '            JO           ';
    supertest(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err,res)=>{
      if(err) return done(err);
        Todo.find({}).then((todos)=>{
          expect(todos.length).toBe(0);
          done();
        }).catch((err)=>{done(err);});
    });
  });
});