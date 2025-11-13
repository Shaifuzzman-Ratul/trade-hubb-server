const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json());

const uri = process.env.MONGO_URI;




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
        // await client.connect();

        const db = client.db('trade-hub');
        const modelCollection = db.collection('products');
        const modelCollection2 = db.collection('exports')
        const modelCollection3 = db.collection('imports')

        app.get('/products', async (req, res) => {
            const result = await modelCollection.find().toArray()
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const { id } = req.params;
            // console.log(id);
            const result = await modelCollection.findOne({ _id: new ObjectId(id) })
            res.send(result)


        })
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await modelCollection.insertOne(data)
            // console.log(data);
            res.send(result)



        })
        app.post('/exports', async (req, res) => {
            const data = req.body;
            const result = await modelCollection2.insertOne(data)
            // console.log(data);
            res.send(result)
        })

        app.post('/imports', async (req, res) => {
            const data = req.body;
            const result = await modelCollection3.insertOne(data)
            // console.log(data);
            res.send(result)
        })
        app.get('/imports', async (req, res) => {
            const result = await modelCollection3.find().toArray()
            res.send(result)
        })

        app.get('/exports', async (req, res) => {
            const result = await modelCollection2.find().toArray()
            res.send(result)
        })
        app.put('/exports/:id', async (req, res) => {
            const { id } = req.params
            const data = req.body

            const filter = { _id: new ObjectId(id) }
            const update = {
                $set: data
            }
            const result = await modelCollection2.updateOne(filter, update)
            res.send(result)
        })
        app.patch('/products/:id', async (req, res) => {
            const { id } = req.params;
            const { availableQuantity } = req.body;
            const result = await modelCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: { availableQuantity }
                })
            res.send(result)
        })

        app.delete('/exports/:id', async (req, res) => {
            const { id } = req.params;
            const data = req.body
            const filter = { _id: new ObjectId(id) }

            const result = await modelCollection2.deleteOne(filter)
            res.send(result)
        })
        app.delete('/imports/:id', async (req, res) => {
            const { id } = req.params;
            const filter = { _id: new ObjectId(id) }

            const result = await modelCollection3.deleteOne(filter)
            res.send(result)
        })

        app.get('/latest', async (req, res) => {
            const result = await modelCollection.find().sort({ createdAt: '-1' }).limit(6).toArray()
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("");
})
app.listen(port, () => {
    console.log(`server is running on ${port}`);

})