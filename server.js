require('dotenv').config();
const express = require("express");
const cors=require('cors')
const mongoose=require('mongoose')
const routes=require('./routes')
const {connectToDB}=require("./config/mongodb")

const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 9876;
const MONGO_URL = process.env.MONGO_URL;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

app.use("/lis/", routes);

app.listen(PORT,()=>{
  console.log("server is running")
  connectToDB()
})


module.exports = app;
