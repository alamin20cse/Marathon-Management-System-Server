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
    const marathonsRegCollection = client.db('marathonsDB').collection('marathonReg');

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

    // update
    
    app.put('/marathons/:id', async (req, res) => {

      const id=req.params.id;
      const filter={_id:new ObjectId(id)}
      const options = { upsert: true };

      updatedMarathon=req.body;
      
     marathon={

        $set:{

    
           marathonTitle:updatedMarathon.marathonTitle,
           startRegistrationDate:updatedMarathon.startRegistrationDate,
           endRegistrationDate:updatedMarathon.endRegistrationDate,
           marathonStartDate:updatedMarathon.marathonStartDate,
           location:updatedMarathon.location,
           runningDistance:updatedMarathon.runningDistance,
           description:updatedMarathon.description,
           marathonImage:updatedMarathon.marathonImage,
           updatedAt:updatedMarathon.updatedAt,
           email:updatedMarathon.email,


          

          
        }
      }
      const result=await marathonsCollection.updateOne(filter,marathon,options);
      res.send(result);


    })



    // Backend API for marathon registration details
app.get('/RegistrationMarathon/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const marathon = await marathonsCollection.findOne(query);
    res.send(marathon);
  });


   // Get all specific user  marathons
//    app.get('/marathons/:email', async (req, res) => {
//     const Email = req.params.email;
//     const query = { email: Email };
//     const result = await marathonsCollection.find(query).toArray();
//     res.send(result);
// });


// for delete operation
app.delete('/marathons/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result=await marathonsCollection.deleteOne(query);
  res.send(result);
})




// for registeion of marathon part

 // Create a new marathon
 app.post('/marathonsreg', async (req, res) => {
  const marathonReg = req.body;
  const result = await marathonsRegCollection.insertOne(marathonReg);
  res.send(result);
});

// Get all marathons
app.get('/marathonsreg', async (req, res) => {
  const cursor = marathonsRegCollection.find();
  const result = await cursor.toArray();
  res.send(result);
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
