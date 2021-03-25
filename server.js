const express = require('express');
const bodyParser= require('body-parser');
const fs = require('fs');

const app = express();
const cors = require('cors');
const parser = bodyParser.urlencoded({ extended: true });

var users = [];

app.use(cors());

app.listen(3000, function() {
    users = getUserData();
    console.log('listening on 3000');
});

app.get('/', function(req, res){
    res.json({message: "Welcome to this API :D"});
});

app.get('/users', function(req, res){
    users = getUserData();
    res.send(users);
});

app.post('/users', parser, (req, res) => {
    users.push(req.body);
    saveUserData(users);

    res.send("Den er lagt op :)");
});

app.delete('/users/:id', parser, function(req, res){
    const person = users[req.params.id];
    if(!person){
        res.sendStatus(404);
    }
    delete users[req.params.id];
    saveUserData(users);
    res.status(200).json({message: "removed", user: person});
});

/*File system*/
const getUserData = () => {
    const jsonData = fs.readFileSync('users.json');
    return JSON.parse(jsonData);
};

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync('users.json', stringifyData);
};

/*Helper functions*/
// FIXME: Apply this function
//   Also, what is this function meant for? removing empty objects from the list?
const filterData = (data) => {
     return data.filter(function (el) {
        return el != null;
      });
};
