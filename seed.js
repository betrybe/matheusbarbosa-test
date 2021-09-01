// colocar query do MongoDB
const MongoClient = require("mongodb").MongoClient;

async function seedDB() {
    const client = new MongoClient('mongodb://mongodb:27017/Cookmaster', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db("Cookmaster");
        // const user = db.collection("users");
        db.drop();
        db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
seedDB();


