////////////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give it a default of 3000 (object destructuring)
// this works by looking for PORT in process.env and if it can't it'll use 3001
const {PORT = 3001, DATABASE_URL} = process.env
// import express
const express = require("express")
// create an application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
////////////////////////////////////////////////////
// import middleware
////////////////////////////////////////////////////
const cors = require("cors")
const morgan = require("morgan")

////////////////////////////////////////////////////
// Database Connection
////////////////////////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {useUnifiedTopology: true, useNewUrlParser: true})

// Connection events
mongoose.connection
.on("open", ()=>{console.log("Connected to Mongo")})
.on("close", ()=>{console.log("Disconnected from Mongo")})
.on("error", (error)=>{console.log(error)})

////////////////////////////////////////////////////
// Model
////////////////////////////////////////////////////
// People Schema
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, {timestamps: true})

const People = mongoose.model("People", PeopleSchema)

////////////////////////////////////////////////////
// Middleware
////////////////////////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies 

////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////
// create a test route
app.get("/", (req, res)=>{
    res.send("Hello world")
})

// People index route 
// get request to /people, returns json of all people
app.get("/people", async (req,res)=>{
    try {
        // send all people
        res.json(await People.find({}))
    } catch(error) {
        res.status(400).json({error})
    }
})

// Create Route
// post request to /people, uses request body to make new people
app.post("/people", async (req, res)=>{
    try{
        // create a new person 
        res.json(await People.create(req.body))
    } catch(error) {
        res.status(400).json({error})
    }
})

// Update route
// put request to /people/:id, updates person based on id
app.put("/people/:id", async (req, res)=>{
    try{
        const id = req.params.id
        res.json(await People.findByIdAndUpdate(id, req.body, {new: true}))
    } catch(error) {
        res.status(400).json({error})
    }
})

// Destroy Route
// delete request to /people/:id, deletes person specified by id
app.delete("/people/:id", async (req, res)=>{
    try{
        // delete a person
        const id = req.params.id
        res.json(await People.findByIdAndDelete(id))
    } catch(error) {
        res.status(400).json({error})
    }
})


////////////////////////////////////////////////////
//
////////////////////////////////////////////////////
app.listen(PORT, ()=>{console.log(`Listening on PORT ${PORT}`)})