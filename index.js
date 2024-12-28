const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.uslpn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const marathonsCollection = client.db('marathonsDB').collection('marathons');

    // Create a new marathon
    app.post('/marathons', async (req, res) => {
      const marathon = req.body;
      const result = await marathonsCollection.insertOne(marathon);
      res.send(result);
    });

    // Get all marathons
    app.get('/marathons', async (req, res) => {
      const cursor = marathonsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get a specific marathon by ID
    app.get('/marathons/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await marathonsCollection.findOne(query);
      res.send(result);
    });


    // Backend API for marathon registration details
app.get('/RegistrationMarathon/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const marathon = await marathonsCollection.findOne(query);
    res.send(marathon);
  });
  
  




    console.log("Connected to MongoDB successfully!");
  } finally {
    // Optionally close the client after operations
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Marathon API is running...');
});

app.listen(port, () => {
  console.log(`Marathon API is running on port: ${port}`);
});
