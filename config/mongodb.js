const mongoose=require("mongoose")
exports.connectToDB=()=>{
    mongoose
  .connect("mongodb+srv://anuragyadav:xaFGgUXPDJe5YLUW@cluster0.ykk6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");
   
  })
  .catch((error) => {
    console.log(error);
  });
}

