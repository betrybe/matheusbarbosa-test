const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://mongodb:27017/Cookmaster'; 
const url = 'http://localhost:3000';
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const path = require('path');

describe('3 - Crie um endpoint para o cadastro de receitas', () => {
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
      {
        name: 'Erick Jacquin',
        email: 'erickjacquin@gmail.com',
        password: '12345678',
        role: 'user',
      },
    ];
    await db.collection('users').insertMany(users);
  });

  after(async () => {
    await connection.close();
  });

  it('Será validado que não é possível cadastrar receita sem o campo "name"', async () => {
    const resLogin = await chai.request(url)
      .post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');
    chai.request(url).post('/recipes')
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
        ingredients: 'Frango',
        preparation: '10 min no forno'
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).have.property('message')
          .equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que não é possível cadastrar receita sem o campo "preparation"', async () => {
    const resLogin = await chai.request(url).post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');
    chai.request(url).post('/recipes')
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })

      .send({
        name: 'Frango assado',
        ingredients: 'Frango'
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).have.property('message')
          .equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que não é possível cadastrar receita sem o campo "ingredients"', async () => {
    const resLogin = await chai.request(url).post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');
    chai.request(url).post('/recipes')
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'Frango assado',
        preparation: '10 min no forno'
      }).end((err, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).have.property('message')
          .equal('Invalid entries. Try again.');
      });
  });

  it('Será validado que não é possível cadastrar uma receita com token invalido', async () => {
    const res = await chai.request(url).post('/recipes')
      .set({
        Authorization: '123411312',
        'Content-Type': 'application/json',
      })
      .send({
        name: 'Frango assado',
        ingredients: 'Frango',
        preparation: '10 min no forno',
      })
    chai.expect(res).to.have.status(401);
    chai.expect(res.body).have.property('message')
      .equal('jwt malformed');

  });

  it('Será validado que é possível cadastrar uma receita com sucesso', async () => {

    const resLogin = await chai.request(url).post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    chai.request(url).post('/recipes')
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'Frango assado',
        preparation: '10 min no forno',
        ingredients: 'frango'
      }).end((err, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(res.body.recipe).have.property('name').equal('Frango assado');
        chai.expect(res.body.recipe).have.property('preparation').equal('10 min no forno')
        chai.expect(res.body.recipe).have.property('ingredients').equal('frango')
        chai.expect(res.body.recipe).have.property('userId').is.not.null

      });
  });
});

describe('4 - Crie um endpoint para a listagem de receitas', () => {
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
      {
        name: 'Erick Jacquin',
        email: 'erickjacquin@gmail.com',
        password: '12345678',
        role: 'user',
      },
    ];
    await db.collection('users').insertMany(users);
    const ListRecipes = [
      {
        name: 'banana caramelizada',
        ingredients: 'banana, açúcar',
        preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
      },
    ];
    await db.collection('recipes').insertMany(ListRecipes);
  });

  after(async () => {
    await connection.close();
  });

  it('Será validado que é possível listar todas as receitas sem estar autenticado', async () => {
    chai.request(url)
      .get('/recipes').end((err, res) => {
        chai.expect(res.body[0]).have.property('name').equal('banana caramelizada');
        chai.expect(res.body[0]).have.property('ingredients').equal('banana, açúcar');
        chai.expect(res.body[0]).have.property('preparation').equal('coloque o açúcar na frigideira até virar caramelo e jogue a banana')
      })
  });

  it('Será validado que é possível listar todas as receitas estando autenticado', async () => {
    const resLogin = await chai.request(url).post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');
    chai.request(url)
      .get('/recipes')
      .send({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .end((err, res) => {
        chai.expect(res.body[0]).have.property('name').equal('banana caramelizada');
        chai.expect(res.body[0]).have.property('ingredients').equal('banana, açúcar');
        chai.expect(res.body[0]).have.property('preparation').equal('coloque o açúcar na frigideira até virar caramelo e jogue a banana')
      })

  });

});

describe('5 - Crie um endpoint para visualizar uma receita específica', () => {
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
      {
        name: 'Erick Jacquin',
        email: 'erickjacquin@gmail.com',
        password: '12345678',
        role: 'user',
      },
    ];
    await db.collection('users').insertMany(users);
    const ListRecipes = [
      {
        name: 'banana caramelizada',
        ingredients: 'banana, açúcar',
        preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
      },
    ];
    await db.collection('recipes').insertMany(ListRecipes);
  });

  after(async () => {
    await connection.close();
  });

  it('Será validado que é possível listar uma receita específica sem estar autenticado', async () => {
    res = await chai.request(url).get('/recipes')
    const recipe = res.body[0]
    chai.request(url)
      .get(`/recipes/${recipe._id}`)
      .end((err, res) => {

      })
  });

  it('Será validado que é possível listar uma receita específica estando autenticado', async () => {
    const resLogin = await chai.request(url).post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');
    resRecipe = await chai.request(url).get('/recipes')
    const recipe = resRecipe.body[0]
    chai.request(url)
      .get(`/recipes/${recipe._id}`)
      .end((err, res) => {
        chai.expect(recipe.name).equal(res.body.name)
        chai.expect(recipe.ingredients).equal(res.body.ingredients)
        chai.expect(recipe._id).equal(res.body._id)
        chai.expect(recipe.preparation).equal(res.body.preparation)
      })
  });

  it('Será validado que não é possível listar uma receita que não existe', async () => {
    chai.request(url)
      .get(`/recipes/4564a56sdasd`)
      .end((err, res) => {
        chai.expect(res.body).have.property('message').equal('recipe not found')
      })
  });

});

describe('7 - Crie um endpoint para a edição de uma receita', () => {
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
      {
        name: 'Erick Jacquin',
        email: 'erickjacquin@gmail.com',
        password: '12345678',
        role: 'user',
      },
    ];
    await db.collection('users').insertMany(users);
    const ListRecipes = [
      {
        name: 'banana caramelizada',
        ingredients: 'banana, açúcar',
        preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
      },
    ];
    await db.collection('recipes').insertMany(ListRecipes);
  });

  after(async () => {
    await connection.close();
  });

  it('Será validado que não é possível editar receita sem estar autenticado', async () => {
    res = await chai.request(url).get('/recipes')
    const recipe = res.body[0]
    chai.request(url).put(`/recipes/${recipe._id}`)
      .send({
        name: 'Receita de frango do Jacquin',
        ingredients: 'Frango',
        preparation: '10 min no forno',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body).property('message').equal('missing auth token')
      });
  });

  it('Será validado que não é possível editar receita com token inválido', async () => {
    res = await chai.request(url).get('/recipes')
    const recipe = res.body[0]
    chai.request(url).put(`/recipes/${recipe._id}`)
      .set({
        Authorization: 'sadasdasdasadfa212r32.',
        'Content-Type': 'application/json',
      })
      .send({
        name: 'Receita de frango do Jacquin',
        ingredients: 'Frango',
        preparation: '10 min no forno',
      }).end((err, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body).property('message').equal('jwt malformed')
      });
  });

  it('Será validado que é possível editar receita estando autenticado', async () => {
    const resLogin = await chai.request(url).post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '12345678'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    res = await chai.request(url).get('/recipes')
    const recipe = res.body[0]
    chai.request(url).put(`/recipes/${recipe._id}`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'Receita de frango do Jacquin',
        ingredients: 'Frango',
        preparation: '10 min no forno',
      }).end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).have.property('name').equal('Receita de frango do Jacquin');
        chai.expect(res.body).have.property('ingredients').equal('Frango');
        chai.expect(res.body).have.property('preparation').equal('10 min no forno')
      });

  });

  it('Será validado que é possível editar receita com usuário admin', async () => {
    const resLogin = await chai.request(url).post('/login')
      .send({
        email: 'root@email.com',
        password: 'admin'
      })
    chai.expect(resLogin).to.have.status(200);
    chai.expect(resLogin.body).have.property('token');

    res = await chai.request(url).get('/recipes')
    const recipe = res.body[0]
    chai.request(url).put(`/recipes/${recipe._id}`)
      .set({
        Authorization: resLogin.body.token,
        'Content-Type': 'application/json',
      })
      .send({
        name: 'Receita de frango do Jacquin',
        ingredients: 'Frango',
        preparation: '10 min no forno',
      }).end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).have.property('name').equal('Receita de frango do Jacquin');
        chai.expect(res.body).have.property('ingredients').equal('Frango');
        chai.expect(res.body).have.property('preparation').equal('10 min no forno')
      });

  });
});
