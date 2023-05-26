const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dudbtcu.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();

        const toyCollection = client.db('carzZone').collection('allCar');

        // get 20 toys
        app.get('/twenty-toy', async (req, res) => {
            const cursor = toyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })

        // get all data
        app.get('/all-toy', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get a sub-category's first two data
        app.get('/sports-car', async (req, res) => {
            const query = { sub_category: "Sports Car" };
            const options = {
                projection: { _id: 1, image: 1, toy_name: 1, price: 1, ratings: 1 },
            };
            const cursor = toyCollection.find(query, options).limit(2);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/service-car', async (req, res) => {
            const query = { sub_category: "Service Car" };
            const options = {
                projection: { _id: 1, image: 1, toy_name: 1, price: 1, ratings: 1 },
            };
            const cursor = toyCollection.find(query, options).limit(2);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/regular-car', async (req, res) => {
            const query = { sub_category: "Regular Car" };
            const options = {
                projection: { _id: 1, image: 1, toy_name: 1, price: 1, ratings: 1 },
            };
            const cursor = toyCollection.find(query, options).limit(2);
            const result = await cursor.toArray();
            res.send(result);
        })

        // find one item for details show
        app.get('/all-toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        })


        // get only one users toy
        app.get('/my-toy', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { seller_email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        })

        // update find one
        app.get('/my-toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result)
        })

        // add my-toy
        app.post('/all-toy', async (req, res) => {
            const newToy = req.body;
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        })


        // receive data from client side
        app.post('/my-toy', async (req, res) => {
            const newCoffee = req.body;
            const result = await toyCollection.insertOne(newCoffee); // add to db
            res.send(result); // send to client
        })

        // update
        app.put('/my-toy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedToy = req.body
            const toy = {
                $set: {
                    seller_name: updatedToy.seller_name,
                    seller_email: updatedToy.seller_email,
                    toy_name: updatedToy.toy_name,
                    sub_category: updatedToy.sub_category,
                    available_quantity: updatedToy.available_quantity,
                    price: updatedToy.price,
                    ratings: updatedToy.ratings,
                    image: updatedToy.image,
                    details: updatedToy.details
                }
            }
            const result = await toyCollection.updateOne(filter, toy, options)
            res.send(result)
        })

        // delete
        app.delete('/my-toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('carz-zone server is running')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})