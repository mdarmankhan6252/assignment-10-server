const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//middle ware
app.use(cors())
app.use(express.json())



app.get('/', (req, res) =>{
   res.send('My server is running')
})




const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.ewhtdrn.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();


    const craftCollection = client.db("craftDB").collection('craft')
    const userCollection = client.db("craftDB").collection('user')

    app.get('/craft', async(req, res) =>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.post('/craft', async(req, res) =>{
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft)
      res.send(result)
    })

    app.delete('/craft/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await craftCollection.deleteOne(query)
      res.send(result)
    })

    //user set in mongodb

    app.post('/user', async(req,res) =>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
    app.get('/users', async(req, res) =>{
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users)
    })

    app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    
   //  await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () =>{
   console.log('My server is running on port : ', port);
})

