const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectId} = require('mongodb') //adding the id too
require('dotenv').config()
const PORT = 7000

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log('Connected to the database')
        db = client.db(dbName)
        collection = db.collection('movies')
    }) 


//middleware
app.use(express.urlencoded({extended: true}))  
app.use(express.json())
app.use(cors())

app.get('/search', async (request, response) => {
    try{
        let result = await collection.aggregate([ // (aggregate)to take a group of things and bring them together. getting search results out of a collection and bundling them into an array od specific word 
            {
                '$search': { //passing in a search
                    'autocomplete': { //indicating that the search is an autocomplet search
                        'query': `${request.query.query}`, //passing in a specfic search query
                        'path': 'title', //search on title within the object
                        'fuzzy': { //fuzzy searcher
                            'maxEdits': 2, //mess up only two characters. make only two substitution of the characters. 2 characted substitution
                            'prefixLength': 3 //users have to type atleast 3 characters in their word before the search will start
                        }
                    }
                }
            }
        ]).toArray()
        response.send(result) //result of the search query
    }catch(error){
        response.status(500).send({message: error.message})
    }
})

app.get('/search/:id', async(request, response) => {
    try{
        let result = await collection.findOne({
            '_id': ObjectId(request.params.id) //database ID
        })
        response.send(result)
    }catch(error){
        response.status(500).send({message: error.message})
    }

})

app.listen(process.env.PORT || PORT, () => {
    console.log(`your server is running on port ${PORT}. Better go catch it!`)
})