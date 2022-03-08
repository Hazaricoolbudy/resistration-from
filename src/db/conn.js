const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/youtuberesistration",{

}).then(()=>{
    console.log("connection sucessfull");
}).catch(()=>{
    console.log("connection unsucessful");
})