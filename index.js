const express = require('express')
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvs3l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors());
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const workCollection = client.db("volunteerWork").collection("works");
  const registrationCollection = client.db("volunteerWork").collection("registrations");

  app.post('/addWork', (req, res) => {
      const works = req.body;
      workCollection.insertMany(works)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)

      })
  })

  app.post('/addRegistration', (req, res) => {
    const registration = req.body;
    registrationCollection.insertOne(registration)
    .then(result => {
        res.send(result.insertedCount > 0)

    })
})


  app.get('/works', (req, res) => {
      workCollection.find({}).limit(21)
      .toArray(( err, documents) =>{
          res.send(documents);
      })
  })

//   app.get('/works/:work', (req,res) => {
//       workCollection.find({work: req.params.work})
//       .toArray((err, documents) =>{
//           res.send(documents)
//       })
//   })

app.post('/worksByWorkName', (req,res)=> {
    const workNames = req.body;
    workCollection.find({work: { $in: workNames}})
    .toArray( (err, documents) => {
        res.send(documents);
    })

})


  


});

app.listen(process.env.PORT || port)