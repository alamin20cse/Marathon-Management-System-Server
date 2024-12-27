const express=require('express');
const cors=require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const app=express();
const port =process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.uslpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const marathonsCollection=client.db('marathonsDB').collection('marathons');


// marathon post
app.post('/marathons',async(req,res)=>{
    const marathons=req.body;
    console.log(marathons);

    const result=await marathonsCollection.insertOne(marathons);
    res.send(result);

})

// marathon get
app.get('/marathons',async(req,res)=>{
    const cursor=marathonsCollection.find();
    const result=await cursor.toArray();
    res.send(result);
})








    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/',(req,res)=>{
    res.send('Marathon  is running   .. ');
});

app.listen(port,()=>{

    console.log(`Marathon is running on port :${port}`);

})