const chai = require('chai');
const userService = require('../api/service/userService'); 
const should = chai.should();
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://mongodb:27017/Cookmaster'

describe('Teste da funcao addUser', () => {
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
          name: 'matheus', email: 'matheus1@barbosa.com', password: '123456', role: 'user'
        };
        await db.collection('users').insertOne(users);
      });
    
      after(async () => {
        await connection.close();
      });

    it('Quando está tudo correto.',async ()  => {
        const user = await userService.addUser('matheus', 'matheus@barbosa.com', '123456');
        chai.expect( user ).have.property('name').equal('matheus');
        chai.expect( user ).have.property('email').equal('matheus@barbosa.com');
        chai.expect( user ).have.property('role').equal('user');

    });
    
    it('Quando faltando password',async ()  => {
        const user = await userService.addUser('matheus', 'matheus@barbosa.com.br', '');
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando faltando email',async ()  => {
        const user = await userService.addUser('matheus', '', '123456');
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando faltando name',async ()  => {
        const user = await userService.addUser('', 'matheus@barbosa.com.br', '123456');
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando email invalido',async ()  => {
        const user = await userService.addUser('matheus', 'matheus', '123456');
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando email duplicado',async ()  => {
        const user = await userService.addUser('matheus', 'matheus1@barbosa.com', '123456');
        chai.expect({ user }).have.property('user').equal('duplicate');
    });
});

describe('Teste da funcao login', () => {
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
          name: 'matheus', email: 'matheus123@barbosa.com', password: '123456', role: 'user'
        };
        await db.collection('users').insertOne(users);
      });
    
      after(async () => {
        await connection.close();
      });

    it('Quando está tudo correto.',async ()  => {
        const user = await userService.login('matheus123@barbosa.com', '123456');
        chai.expect( user ).not.equal('invalid')
        chai.expect( user ).not.equal('Incorrect')
    });
    
    it('Quando faltando password',async ()  => {
        const user = await userService.login('matheasdus14@barbosa.com.br', '');
        chai.expect(user).equal('invalid');
    });

    it('Quando faltando email',async ()  => {
        const user = await userService.login('', '123456');
        chai.expect(user).equal('invalid');
    });

    it('Quando email invalido',async ()  => {
        const user = await userService.login('matheus', '123456');
        chai.expect({ user }).have.property('user').equal('Incorrect');
    });

    it('Quando email incorreto',async ()  => {
        const user = await userService.login('matheus1a1@barbosa.com', '123456');
        chai.expect({ user }).have.property('user').equal('Incorrect');
    });

    it('Quando password incorreto',async ()  => {
        const user = await userService.login('matheus', 'matheus', '1234567');
        chai.expect({ user }).have.property('user').equal('Incorrect');
    });

    it('addUser quando faltando email invalido',async ()  => {
        const user = await userService.login('matheus', 'matheus', '123456');
        chai.expect({ user }).have.property('user').equal('Incorrect');
    })
});

describe('Teste da funcao addAdmin', () => {
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
          name: 'matheus', email: 'asd@barbosasdaa.com', password: '123456', role: 'admin'
        };
        await db.collection('users').insertOne(users);
      });
    
      after(async () => {
        await connection.close();
      });

    it('Quando está tudo correto.',async ()  => {
        const user = await userService.addAdmin('newMatheus', 'newMatheus@barbosa.com', '123456', { email: 'matheus@barbosa.com', role: 'admin'});
        chai.expect( user ).have.property('name').equal('newMatheus');
        chai.expect( user ).have.property('email').equal('newMatheus@barbosa.com');
        chai.expect( user ).have.property('role').equal('admin');

    });
    
    it('Quando faltando password',async ()  => {
        const ReqUser = { email: 'matheus@barbosa.com', role: 'admin' }
        const user = await userService.addAdmin('newMatheus', '', '123456', ReqUser);

        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando faltando email',async ()  => {
        const ReqUser = { email: 'matheus@barbosa.com', role: 'admin' }
        const user = await userService.addAdmin('newMatheus', '', '123456', ReqUser);

        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando faltando name',async ()  => {
        const user = await userService.addAdmin('', 'newMatheus@barbosa.com', '123456', { email: 'matheus@barbosa.com', role: 'admin' });
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando email invalido',async ()  => {
        const user = await userService.addAdmin('matheus', 'matheus', '123456',{ email: 'matheus@barbosa.com', role: 'admin' });
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando email duplicado',async ()  => {
        const user = await userService.addAdmin('matheus', 'asd@barbosasdaa.com', '123456',{ email: 'matheus@barbosa.com', role: 'admin' });
        chai.expect({ user }).have.property('user').equal('duplicate');
    });

    it('Quando role diferente de admin',async ()  => {
        const user = await userService.addAdmin('matheus', 'newMatheus@barbosa.com', '123456', { email: 'matheus@barbosa.com', role: 'user' });
        chai.expect({ user }).have.property('user').equal('limited');
    });

});