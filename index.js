const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const StockUsers = require('./modules/userenteredfilters.js')
const app = express()
dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
const mongodb_url = process.env.mongo_url;
mongoose.connect(mongodb_url, {
})
    .then(() => console.log('DataBase Connected'))
    .catch((err) => console.log(err))

app.get('/user', async (req, res) => {
    const { Email, Password } = req.query;
    try {
        const UserSignIn = await StockUsers.findOne({ Email })
        if (!UserSignIn) {
            res.status(200).json({ message: 'User Not Exict' })
        }
        else {
            if (UserSignIn.Password !== Password) {
                res.status(200).json({ message: 'Password Does not Match' })
            }
            else {
                res.status(200).json({ message: 'User Exict' })
            }
        }

    } catch (error) {
        console.log(error)
    }
})

app.post('/userstorage', async (req, res) => {
    const { Name, Email, Password } = req.body;
    try {
        const User = await StockUsers({ Name, Email, Password })
        await User.save()
        // const userCollectionName = Email.replace('@', '_').replace('.', '_'); // Create valid collection name
        // const mongodb = mongoose.connection;
        // const userCollection = mongodb.collection(userCollectionName);
        const userEmailCollectionName = `user_${Email.replace('@', '_').replace('.', '_')}`;
        const UserEmail = mongoose.model(userEmailCollectionName, new mongoose.Schema({}));
        await UserEmail.create({}); // Insert a dummy document to create the collection
        res.status(200).json({ message: 'User Created'})
    } catch (error) {
        console.log(error);
    }
})


app.post('/addwatchlist',async (req,res) => {
    const {Email,stock} = req.body;
    console.log(Email,stock);
})

app.get('/watchlistdata',async (req,res) => {
    const {Email} = req.query;
    try {
        // Sanitize the Email to create the collection name
        const CollectionName = `user_${Email.replace('@', '_').replace('.', '_')}`;
        
        // Check if the collection exists in the database
        const collectionExists = await mongoose.connection.db.listCollections({ name: CollectionName }).hasNext();
    
        if (!collectionExists) {
          return res.status(404).json({ message: 'Collection not found' });
        }
    
        // Get the Mongoose model based on the CollectionName
        const Model = mongoose.model(CollectionName);
    
        // Fetch all documents from the collection
        const documents = await Model.find();
        console.log('Good');
        res.json(documents);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
})


const port = 5000
app.listen(port, () => console.log('Server is Listening'))