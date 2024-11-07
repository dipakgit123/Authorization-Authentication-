const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
const userModel = require("./models/user")

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))


// app.get("/", (req,res)=>{

//     // res.cookie("name", "dipak")  // save data from server to browser is called as cookies
//     // res.end("done")

//      //encryption
//     // bcrypt.genSalt(10, function(err, salt) {
//     //     bcrypt.hash("B4c0/\/", salt, function(err, hash) {
//     //         // Store hash in your password DB.

//     //         console.log(hash)

//     //     });
//     // });

//     //decryption

//     // bcrypt.compare("B4c0/\/", "2a$10$JxjRzc5a8PuOoxOPxWlJnOaK9ukqQXju9Bz9EXvkkzNE/GZBNEEEO", function(err, res) {
//     //     // res === true
//     //     console.log(res)
//     // });


//     let token = jwt.sign({email:"dipak@gmail.com"}, "secretKey")
//     // console.log(token)

//     res.cookie("token", token)

//     res.send("done")




//    //jwt




// })


// app.get("/read", (req,res)=>{
    

//     //decrypt 

//     let data = jwt.verify(req.cookies.token,  "secretKey")

//     console.log(data)
//     res.send("read")
// })




app.get("/", (req,res)=>{
    res.render("index")
})


app.post("/create", (req,res)=>{
    let {username, email, password, age} = req.body

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password, salt, async (err,hash)=>{

            let createdUser= await userModel.create({
                username,
                email,
                password:hash,
                age
            })

         let token =  jwt.sign({email}, "dipak");
         res.cookie("token", token)

            res.send(createdUser)
        })
    })

  
})


app.get("/login", (req,res)=>{
    res.render("login")
})
app.post("/login", async (req, res) => {
    try {
        // Find the user by email
        let user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.send("User not found");

        // Compare passwords
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            let token = jwt.sign({ email: user.email }, "dipak");
            res.cookie("token", token, { httpOnly: true });
            res.send("Login successfully");
        } else {
            res.send("Incorrect password");
        }
    } catch (error) {
        res.status(500).send("An error occurred");
    }
});

app.get("/logout", function(req,res){

    res.cookie("token", "")
    res.redirect("/")

})


app.listen(3000)