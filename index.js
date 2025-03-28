const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const e = require('express');

const app = express();
const port = process.env.PORT || 5000;
const corsOption = {
  origin: [
    'http://localhost:5173',
    'https://marathon-management-syst-7b404.web.app',
    'https://marathon-management-syst-7b404.firebaseapp.com'

  ],
  credentials: true,
  optionsSuccessStatus: 200
};



// Middleware
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser())




const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.uslpn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


const verifyToken= (req,res,next)=>{
 const token=req.cookies?.token;
 if(!token) return res.status(401).send({message:'unAuthorized access'})
  jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
if(err) {
  return res.status(401).send({message:'unAuthorized access'})
}

req.user=decoded


  })
 



  next();

}


async function run() {
  try {
    // await client.connect();
    const marathonsCollection = client.db('marathonsDB').collection('marathons');
    const marathonsRegCollection = client.db('marathonsDB').collection('marathonReg');
  
    // generate jwt
    app.post('/jwt',async(req,res)=>{
      const email=req.body;
      // create token
      const token= jwt.sign(email,process.env.SECRET_KEY,{expiresIn:'100d'})

      // console.log(token);
      // res.send(token);
      res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'? 'none': 'strict'


      }).send({success:true})
    })


    // logout cookie
    // clear cookie
    app.get('/logout',async(req,res)=>{
      res.clearCookie('token',{
       maxAge: 0,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'? 'none': 'strict'

      }).send({success:true})
    })






    // Create a new marathon
    app.post('/marathons', async (req, res) => {
      const marathon = req.body;
      const result = await marathonsCollection.insertOne(marathon);
      res.send(result);
    });


    app.get('/marathons',verifyToken, async (req, res) => {
      try {
        const sort = req.query.sort;
        let sortOptions = {};
    
        if (sort === 'asc') {
          sortOptions = { createdAt: 1 }; // Ascending order
        } else if (sort === 'desc') {
          sortOptions = { createdAt: -1 }; // Descending order
        }
    
        const result = await marathonsCollection.find({}).sort(sortOptions).toArray();
        res.send(result);
      } catch (err) {
        console.error('Error fetching marathons:', err.message);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });
    



      // Get all using limit marathons
      app.get('/marathonslimit', async (req, res) => {
        const cursor = marathonsCollection.find().limit(6);
        const result = await cursor.toArray();
        res.send(result);
      });



       // Get all using limit upcoming marathons
       app.get('/marathonsupcoming', async (req, res) => {
        
        const cursor = marathonsCollection.find().sort({marathonStartDate:1});
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


// ========================================
// =================================

// for registeion of marathon part===============


 // Create a new marathon regestion 
//  1.save data in registion
 app.post('/marathonsreg', async (req, res) => {
  const marathonReg = req.body;
  const result = await marathonsRegCollection.insertOne(marathonReg);
  // 2. increase reg count in marathon
  const filter ={_id:new ObjectId(marathonReg.marathonID)}
  const  update={
    $inc:{totalRegistrationCount: 1},

  }
  const updateRegCount=await marathonsCollection.updateOne(filter,update)
  console.log(updateRegCount)
  res.send(result);
});






// Get all marathons registration My apply
// =====Apply
app.get('/marathonsreg',verifyToken, async (req, res) => {

  const decodedEmail=req.user?.email;
 
  // console.log('email fo token :',decodedEmail);
  



  const search = req.query.search; // Use req.query to access query parameters
  // console.log(search); 

  const query = search
    ? { marathonTitle: { $regex: search, $options: 'i' } } // Case-insensitive search
    : {};

  const cursor = marathonsRegCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});



  
app.delete('/marathonsreg/:id', async (req, res) => {
  const id = req.params.id;


  try {
    // Ensure `id` is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    // Find the registration to delete
    const registration = await marathonsRegCollection.findOne({ _id: new ObjectId(id) });

    if (!registration) {
      return res.status(404).send({ message: 'Registration not found' });
    }

    // Delete the registration
    const deleteResult = await marathonsRegCollection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount > 0) {
      // Decrease the registration count in the marathons collection
      const filter = { _id: new ObjectId(registration.marathonID) };
      const update = {
        $inc: { totalRegistrationCount: -1 }, // Decrease count by 1
      };

      const updateRegCount = await marathonsCollection.updateOne(filter, update);

      if (updateRegCount.modifiedCount > 0) {
        console.log('Registration count updated successfully');
        res.send({ message: 'Registration deleted and count updated successfully' });
      } else {
        res.status(500).send({ message: 'Failed to update registration count' });
      }
    } else {
      res.status(500).send({ message: 'Failed to delete registration' });
    }
  } catch (error) {
    console.error('Error during delete operation:', error);
    res.status(500).send({ message: 'An error occurred', error: error.message });
  }
});




    // Get a specific regristion marathon by ID
    app.get('/marathonsreg/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await marathonsRegCollection.findOne(query);
      res.send(result);
    });


    
    app.put('/marathonsreg/:id', async (req, res) => {

      const id=req.params.id;
      const filter={_id:new ObjectId(id)}
      const options = { upsert: true };

      updatedReg=req.body;
      
     reg={


        $set:{

          
           email:updatedReg.email,
           marathonTitle:updatedReg.marathonTitle,
           marathonStartDate:updatedReg.marathonStartDate,
           firstName:updatedReg.firstName,
           contactNumber:updatedReg.contactNumber,
           additionalInfo:updatedReg.additionalInfo,
           marathonID:updatedReg.marathonID,



        

          
        }
      }
      const result=await marathonsRegCollection.updateOne(filter,reg,options);
      res.send(result);


    })

    





















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
