const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const fs = require('fs');
var cors = require('cors');

var users = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(3000, function() {
    console.log('listening on 3000');
});

app.get('/', function(req, res){
    const users = getUserData();
    res.send(users);
});

app.get('/users', function(req, res){
    users = getUserData();
    res.send(users);
});

app.post('/addUser', (req, res) => {
    users.push(req.body);
    saveUserData(users);

    res.send("Den er lagt op :)");
});

app.delete('/users/:id', function(req, res){
    const person = users[req.params.id];
    if(!person){
        res.sendStatus(404);
    }
    delete users[req.params.id];
    saveUserData(users);
    res.sendStatus(200);
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
const filterData = (data) => {
     return data.filter(function (el) {
        return el != null;
      });
};
