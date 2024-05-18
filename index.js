const express = require("express");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const PORT = 7060;
const app = express();


var requestLogger = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(express.json());
app.use(morgan('dev'));  
app.use(morgan('combined', { stream: requestLogger }));  

app.get("/app/api/response", (req, res) => {
    const data = {
        name: "prime",
        price: 600,
        "sugar-content": "7%"
    };

    res.status(200).json({
        status: true,
        message: "Response is correct on port",
        response: data,
    });
});


const authorization = (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }
        console.log("User logged in");
        next(); 
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

app.post("/user/authentication", authorization, (req, res) => {

    res.status(200).json({
        message: "Logged in successfully",
        user: {
            email: req.body.email,
            status: "Authenticated"
        }
    });
});

app.listen(PORT, () => {
    console.log("SERVER IS UP AND RUNNING ON PORT", PORT);
});