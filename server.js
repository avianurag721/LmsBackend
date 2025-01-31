require('dotenv').config();

const express = require("express");
const cors=require('cors')
const mongoose=require('mongoose')
const routes=require('./routes')

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

app.use("/", routes);

mongoose
  .connect("mongodb+srv://anuragyadav:xaFGgUXPDJe5YLUW@cluster0.ykk6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
