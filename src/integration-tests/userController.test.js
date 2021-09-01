const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../api/app')




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
    chai.request(app).post('/users')
      .send({
        email: 'asda@gmail.com',
        password: '12345678',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que o campo "email" é obrigatório', function () {
    chai.request(app).post('/users')
      .send({
        name: 'Erick Jacquin',
        password: '12345678',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que não é possível cadastrar usuário com o campo email inválido', function () {
    chai.request(app).post('/users')
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
    chai.request(app).post('/users')
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
    chai.request(app).post('/users')
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
    chai.request(app).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'erickjaquin',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que o campo "senha" é obrigatório', function () {
    chai.request(app).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'mathasdeus@barbosa.com'
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que o campo "email" é único', async () => {
    const respCad = await chai.request(app)
      .post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'teste@teste.com',
        password: '123456'
      })
    chai.expect(respCad).to.have.status(201);

    chai.request(app).post('/users')
      .send({
        name: 'Erick Jacquin',
        email: 'teste@teste.com',
        password: '123456'
      }).end((err, res2) => {
        chai.expect(res2).to.have.status(409);
        chai.expect(res2.body.message).to.equal('Email already registered');
      });
  });

  it('Será validado que é possível ao cadastrar usuário, o valor do campo "role" tenha o valor "user"', function () {
    chai.request(app).post('/users')
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
    chai.request(app).post('/login')
      .send(
        {
          password: '12345678',
        }).end((err, res) => {
          chai.expect(res).to.have.status(401);
          chai.expect(res.body.message).to.equal('All fields must be filled');
        });
  });

  it('Será validado que o campo "password" é obrigatório', function () {
    chai.request(app).post('/login')
      .send({
        email: 'erickjaqui14n@gmail.com',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('All fields must be filled');
      });
  });

  it('Será validado que não é possível fazer login com um email inválido', function () {
    chai.request(app).post('/login')
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
    chai.request(app).post('/login')
      .send({
        email: 'erickjacqui12n@gmail.com',
        password: '123456',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('Incorrect username or password');
      });
  });

  it('Será validado que não é possível fazer login com uma senha inválida', function () {
    chai.request(app).post('/login')
      .send({
        email: 'erickjacquin13@gmail.com',
        password: '123456',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('Incorrect username or password');
      });
  });

  it('Será validado que o campo "email" é único', function () {
    let agent = chai.request.agent(app)
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
});

describe('12 - Crie um endpoint para cadastro de pessoas administradoras', () => {
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
    const users = [
      { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
      { name: 'Erick Jacquin', email: 'erickjacquin@gmail.com', password: '12345678', role: 'user' },
    ];
    await db.collection('users').insertMany(users);
  });

  after(async () => {
    await connection.close();
  });

  it('Será validado que não é possível cadastrar um usuário admin, sem estar autenticado como um usuário admin', async () => {
    const resLogin = await chai.request(app).post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    chai.request(app)
      .post(`/users/admin`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'usuario admin',
        email: 'usuarioadmin@email.com',
        password: 'admin',
      }).end((err, res) => {
        chai.expect(res).to.have.status(403);
        chai.expect(res.body).have.property('message').equal('Only admins can register new admins')

      });
  });

  it('Será validado que não é possível cadastrar um usuário admin, sem name', async () => {
    const resLogin = await chai.request(app).post('/login')
      .send({
        email: 'root@email.com',
        password: 'admin'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    chai.request(app)
      .post(`/users/admin`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        email: 'usuarioadmin@email.com',
        password: 'admin',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).have.property('message').equal('Invalid entries. Try again.')

      });
  });

  it('Será validado que não é possível cadastrar um usuário admin, sem email', async () => {
    const resLogin = await chai.request(app).post('/login')
      .send({
        email: 'root@email.com',
        password: 'admin'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    chai.request(app)
      .post(`/users/admin`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'usuario admin',
        password: 'admin',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).have.property('message').equal('Invalid entries. Try again.')

      });
  });

  it('Será validado que não é possível cadastrar um usuário admin, sem password', async () => {
    const resLogin = await chai.request(app).post('/login')
      .send({
        email: 'root@email.com',
        password: 'admin'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    chai.request(app)
      .post(`/users/admin`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'usuario admin',
        email: 'usuarioadmin@email.com',
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).have.property('message').equal('Invalid entries. Try again.')

      });
  });

  it('Será validado que não é possível cadastrar um usuário admin com email unico', async () => {
    const resLogin = await chai.request(app).post('/login')
      .send({
        email: 'root@email.com',
        password: 'admin'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    const cad1 = await chai.request(app)
      .post(`/users/admin`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'usuario admin',
        email: 'usuarioadmin@email.com',
        password: '1234'
      })
    chai.expect(cad1).to.have.status(201);

    chai.request(app)
      .post(`/users/admin`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'usuario admin',
        email: 'usuarioadmin@email.com',
        password: '1234'
      }).end((err, res) => {
        chai.expect(res).to.have.status(409);
        chai.expect(res.body).have.property('message').equal('Email already registered')

      });
  });

  it('Será validado que não é possível cadastrar um usuário admin', async () => {
    const resLogin = await chai.request(app).post('/login')
      .send({
        email: 'root@email.com',
        password: 'admin'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');
    chai.request(app)
      .post(`/users/admin`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'usuario admin',
        email: 'usuarioadmin@email.com',
        password: '1234'
      }).end((err, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(res.body.user).have.property('_id');
        chai.expect(res.body.user.name).equal('usuario admin');
        chai.expect(res.body.user.email).equal('usuarioadmin@email.com');
        chai.expect(res.body.user.role).equal('admin');
      });
  });

});