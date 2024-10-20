const express = require("express");
const users = require("./Sample.json");
const cors = require("cors");
const fs = require("fs"); 

const app = express();
app.use(express.json());
const port = 8000;
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })
)

// Display All Users
app.get("/users", (req, res) => {
    return res.json(users);
});

// Delete User Details
app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user)=>user.id !== id);
    fs.writeFile("./Sample.json",JSON.stringify(filteredUsers),(err,data)=>{
        return res.json(filteredUsers);
    })
})

// Add new user
app.post("/users",(req,res)=>{
    let {name,age,city} = req.body;
    if(!name || !age || !city){
        res.status(400).send({message:"All fields required"})
    }
    let id= Date.now();
    users.push({id,name,age,city})
    fs.writeFile("./Sample.json",JSON.stringify(filteredUsers),(err,data)=>{
        return res.json({message:"User detail added success"})

    })
})

//update user
app.patch("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let {name,age,city} = req.body;
    if(!name || !age || !city){
        res.status(400).send({message:"All fields required"})
    }
    let index = users.findIndex((user)=>user.id === id);
    users.splice(index,1,{...req.body});
    fs.writeFile("./Sample.json",JSON.stringify(filteredUsers),(err,data)=>{
        return res.json({message:"User detail updated success"})

    })
})
 

app.listen(port, (error) => {
    console.log(`App is running in port ${port}`,error)
});