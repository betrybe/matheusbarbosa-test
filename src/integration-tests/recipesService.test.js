const chai = require('chai');
const recipesService = require('../api/service/recipesService');
const should = chai.should();
const { MongoClient } = require('mongodb');
const mongoDbUrl = 'mongodb://mongodb:27017/Cookmaster'


describe('Teste da funcao list', () => {
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
        const user = {
            name: 'matheus', email: 'matheus1@barbosa.com', password: '123456', role: 'admin'
        };

        const recipe = {
            _id: '612906b4c18f463fe89131f9',
            name: 'frangao',
            ingredients: 'Frango sazon',
            preparation: '10 minutos no forno',
            userId: '6128832630410c8e1c377269'
        }

        await db.collection('users').insertOne(user);
        await db.collection('recipes').insertOne(recipe);
    });

    after(async () => {
        await connection.close();
    });

    it('Quando está tudo correto.', async () => {
        const recipes = await recipesService.list();
        chai.expect(recipes).to.be.an('array')
    })
});

describe('Teste da funcao find', () => {
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
        const user = {
            name: 'matheus', email: 'matheus1@barbosa.com', password: '123456', role: 'admin'
        };

        const recipe = {
            _id: '61290e9dab6cae82dc9f75ca',
            name: 'frangao',
            ingredients: 'Frango sazon',
            preparation: '10 minutos no forno',
            userId: '6128832630410c8e1c377269'
        }

        await db.collection('users').insertOne(user);
        await db.collection('recipes').insertOne(recipe);
    });

    after(async () => {
        await connection.close();
    });

    it('Quando id invalido.', async () => {
        const recipe = await recipesService.find('99999');
        chai.expect(recipe).equal('not found');
    })

    it('Quando id não existe.', async () => {
        const recipe = await recipesService.find('6128832630410c8e1c377269');
        chai.expect(recipe).equal('not found');
    })

});

describe('Teste da funcao create', () => {
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
        const user = {
            name: 'matheus', email: 'matheus1@barbosa.com', password: '123456', role: 'admin'
        };

        const recipe = {
            _id: '61290e9dab6cae82dc9f75ca',
            name: 'frangao',
            ingredients: 'Frango sazon',
            preparation: '10 minutos no forno',
            userId: '6128832630410c8e1c377269'
        }

        await db.collection('users').insertOne(user);
        await db.collection('recipes').insertOne(recipe);
    });

    after(async () => {
        await connection.close();
    });

    it('Quando está tudo correto.', async () => {
        const reqUser = { email: 'matheus@barbosa.com', role: 'admin', id: '6128832630410c8e1c377269' }
        const user = await recipesService.create('frangao', 'Frango sazon', '10 minutos no forno', reqUser);
        chai.expect(user).have.property('name').equal('frangao');
        chai.expect(user).have.property('ingredients').equal('Frango sazon');
        chai.expect(user).have.property('preparation').equal('10 minutos no forno');
        chai.expect(user).have.property('userId').equal('6128832630410c8e1c377269');

    });

    it('Quando faltando name', async () => {
        const reqUser = { email: 'matheus@barbosa.com', role: 'admin', id: '6128832630410c8e1c377269' }
        const user = await recipesService.create('', 'Frango sazon', '10 minutos no forno', reqUser);
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando faltando ingredients', async () => {
        const reqUser = { email: 'matheus@barbosa.com', role: 'admin', id: '6128832630410c8e1c377269' }
        const user = await recipesService.create('frangao', '', '10 minutos no forno', reqUser);
        chai.expect({ user }).have.property('user').equal('invalid');
    });

    it('Quando faltando preparation', async () => {
        const reqUser = { email: 'matheus@barbosa.com', role: 'admin', id: '6128832630410c8e1c377269' }
        const user = await recipesService.create('frangao', 'Frango sazon', '', reqUser);
        chai.expect({ user }).have.property('user').equal('invalid');
    });

});

describe('Teste da funcao exclude', () => {
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
        const user = {
            name: 'matheus', email: 'matheus1@barbosa.com', password: '123456', role: 'admin'
        };

        const recipe = {
            _id: '6129345e1078b850547e2e4f',
            name: 'frangao',
            ingredients: 'Frango sazon',
            preparation: '10 minutos no forno',
            userId: '6128832630410c8e1c377269'
        }

        await db.collection('users').insertOne(user);
        await db.collection('recipes').insertOne(recipe);

    });

    after(async () => {
        await connection.close();
    });

    it('Quando tudo correto.', async () => {
        const reqUser = { email: 'matheus@barbosa.com', role: 'admin', id: '6128832630410c8e1c377269' }
        const recipe = await recipesService.deletar('612906b4c18f463fe89131f9', reqUser);
        chai.expect(recipe).equal('');
    })

    it('Quando id não informado.', async () => {
        const reqUser = { email: 'matheus@barbosa.com', role: 'user', id: '6128832630410c8e1c377269' }
        const recipe = await recipesService.deletar('', reqUser);
        chai.expect(recipe).equal('missing');
    })
});