const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';
const url = 'http://localhost:3000';
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe('1 - Crie um endpoint para o cadastro de usuários', () => {
  var connection;
  var db;

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({ });
    await db.collection('recipes').deleteMany({ });
    const users = {
      name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin'
    };
    await db.collection('users').insertOne(users);
  });

  after(async () => {
    await connection.close();
  });

  it('Será validado que o campo "name" é obrigatório', function () {
    chai.request(url).post('/users')
      .send({
        email: 'asda@gmail.com',
        password: '12345678',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que o campo "email" é obrigatório', function () {
    chai.request(url).post('/users')
      .send({
        name: 'Erick Jacquin',
        password: '12345678',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que não é possível cadastrar usuário com o campo email inválido', function () {
    chai.request(url).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'erickjaquin',
        password: '12345678',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que não é possível cadastrar usuário com o campo email inválido', function () {
    chai.request(url).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'erickjaquin@casda',
        password: '12345678',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que não é possível cadastrar usuário com o campo email inválido', function () {
    chai.request(url).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'erickjaquin@asdasdÀÀ.',
        password: '12345678',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que o campo "senha" é obrigatório', function () {
    chai.request(url).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'erickjaquin',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que o campo "senha" é obrigatório', function () {
    chai.request(url).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'mathasdeus@barbosa.com'
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que o campo "email" é único', function () {
    let agent = chai.request.agent(url)
    agent.post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'teste@teste.com',
        password: '123456'
      }).end((err, res1) => {
        chai.expect(res1).to.have.status(201);
        agent.post('/users')
          .send({
            name: 'Erick Jacquin',
            email: 'teste@teste.com',
            password: '123456'
          }).end((err, res2) => {
            chai.expect(res2).to.have.status(409);
            chai.expect(res2.body.message).to.equal('Email already registered');
          });
      });
    agent.close()
  });

  it('Será validado que é possível ao cadastrar usuário, o valor do campo "role" tenha o valor "user"', function () {
    chai.request(url).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'matheusad@barbosa.com',
        password: '123456'
      }).end((err, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(res.body.user.name).to.equal('Erick Jacquin');
        chai.expect(res.body.user.email).to.equal('matheusad@barbosa.com');
        chai.expect(res.body.user.role).to.equal('user');
        chai.expect(res.body.user._id).not.undefined
      });
  });
});

describe('2 - Crie um endpoint para o login de usuários', () => {
  let connection;
  let db;

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({ });
    await db.collection('recipes').deleteMany({ });
    const users = {
      name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin'
    };
    await db.collection('users').insertOne(users);
  });

  after(async () => {
    await connection.close();
  });


  it('Será validado que o campo "email" é obrigatório', function () {
    chai.request(url).post('/login')
      .send(
        {
          password: '12345678',
        }).end((err, res) => {
          chai.expect(res).to.have.status(401);
          chai.expect(res.body.message).to.equal('All fields must be filled');
        });
  });

  it('Será validado que o campo "password" é obrigatório', function () {
    chai.request(url).post('/login')
      .send({
        email: 'erickjaqui14n@gmail.com',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('All fields must be filled');
      });
  });

  it('Será validado que não é possível fazer login com um email inválido', function () {
    chai.request(url).post('/login')
      .send({
        email: 'erickjaquin31@3.com',
        password: '12345678',
      })
      .end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('Incorrect username or password');
      });
  });

  it('Será validado que não é possível fazer login com uma senha inválida', function () {
    chai.request(url).post('/login')
      .send({
        email: 'erickjacqui12n@gmail.com',
        password: '123456',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('Incorrect username or password');
      });
  });

  it('Será validado que não é possível fazer login com uma senha inválida', function () {
    chai.request(url).post('/login')
      .send({
        email: 'erickjacquin13@gmail.com',
        password: '123456',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('Incorrect username or password');
      });
  });

  it('Será validado que é possível fazer login com sucesso', async () => {
    const resCad = await chai.request(url)
      .post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'matheusad@barbosa.com',
        password: '123456'
      })
    chai.request(url)
      .post('/login')
      .send({
        email: 'matheusad@barbosa.com',
        password: '123456'
      }).end((err, res2) => {
        chai.expect(res2).to.have.status(200);
      });
  })
});