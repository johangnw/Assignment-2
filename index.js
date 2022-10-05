const express = require('express');
const app = express();
const PORT = 3000;
let jwt = require('jsonwebtoken');

const fs = require('fs');
const { json } = require('express');


app.use(json())


app.post('/gettoken',(req,res) => {
    const { username, password } = req.body;
    const jsonData = fs.readFileSync('./data.json');
    const data = JSON.parse(jsonData);
    const auth = data['auth'];

    if(username != auth['username']){
        return res.status(400).send("Username or Password incorrect");
    }

    if(password != auth['password']){
        return res.status(400).send("Username or Password incorrect");
    }

    const token = jwt.sign({username},"Johan",{expiresIn : '1h'});

    res.status(200).send({"token" : token});
});


const verification = (req, res, next) => {
    let authHeader = req.headers['auth'];
    if(typeof authHeader !== 'undefined'){
        const token = authHeader;
        jwt.verify(token,'Johan',(err, data) => {
            if(err) {
                return res.sendStatus(401);
            }
            req.username = data.username;
            next();
        })
    }else{
        return res.sendStatus(401);
    }
}

app.get('/getdata',verification,(req,res) => {
    const jsonData = fs.readFileSync('./data.json');
    const data = JSON.parse(jsonData);
    const auth = data['auth'];

    if(req.username != auth['username']){
        return res.sendStatus(401);
    }

    return res.status(200).send(data['data']);

});


app.listen(PORT || 3000, () => {
    console.log("Server sedang berjalan!");
});