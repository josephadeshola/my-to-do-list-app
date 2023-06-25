const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const URI = "mongodb+srv://adesholajoseph99:Kinstar125d@cluster0.alugxvk.mongodb.net/docsign_db?retryWrites=true&w=majority"

mongoose.connect(URI)

    .then(() => {
        console.log("mongoose is working");
    })
    .catch((err) => {
        console.log(err);
    })

const userdetails = {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, requirde: true },

}

const tododetails = {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}

let userModel = mongoose.model('user_information', userdetails)
console.log(userModel);
let todoModel = mongoose.model('user_todoinformation', tododetails)
console.log(todoModel);


app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/index", (req, res) => {
    res.render("index")
})
app.get("/signup", (req, res) => {
    res.render("signup", { message: "" })
})
app.get("/signin", (req, res) => {
    res.render("signin", { message: "" })
})
app.use(express.static("public"))
app.get("/dashboard", (req, res) => {
    todoModel.find()
        .then((response) => {
            console.log(response);
            res.render("dashboard", { response })
        })
        .catch((err) => {
            console.log(err);
        })

})

app.post("/dashboard", (req, res) => {
    let todoForm = new todoModel(req.body)
    todoForm.save()
        .then(() => {
            console.log("todo save");
            res.redirect("dashboard")
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/delete", (req, res) => {
    todoModel.findOneAndDelete({ _id: req.body.userId })
        .then((response) => {
            console.log(response);
            res.redirect("dashboard")

        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/edit",(req,res)=>{
    todoModel.findOne({_id:req.body.userId})
    .then((response)=>{
        console.log(response);
        res.render("edituser", {eachItem:response})
    })
})

app.post("/update", (req,res)=>{
    let id = req.body.id
    todoModel.findOneAndUpdate(id, req.body)
    .then((response)=>{
        console.log(response);
        res.redirect("dashboard")
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.post("/signup", (req, res) => {
    console.log(req.body);
    let form = new userModel(req.body)
    form.save()
        .then(() => {
            console.log('good');
            res.redirect("/signin")
        })
        .catch((err) => {
            if (err.code === 11000) {
                console.log(err.code);
                res.render("signup", { message: "Email already exist" })
                
            }
            else {
                res.render("signup", { message: "The is required" })
            }
        })
})

app.post("/signin",(req, res) => {
    
    userModel.find({email:req.body.email,password:req.body.password})
    .then((response)=>{
        console.log(response);
        if(response.length > 0){
            res.redirect("dashboard")
        }
        else{
            res.render("signin", {message:"Incorrect email or password"})
        }
    })
    .catch((err)=>{
        console.log(err);
    })

})


app.listen(3500, () => {
    console.log("saver day work");
})