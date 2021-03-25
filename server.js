const express = require('express');
const bodyParser= require('body-parser');
const fs = require('fs');

const app = express();
const cors = require('cors');
const parser = bodyParser.urlencoded({ extended: true });

var users = [];

app.use(cors());

app.listen(3000, () => {
    getUserData();
    console.log('listening on 3000');
});

app.get('/', (req, res) => {
    res.json({message: "Welcome to this API :D"});
});

app.get('/users', (req, res) => {
    getUserData();
    res.send(users);
});

app.post('/users', parser, (req, res) => {
    users.push(req.body);
    saveUserData(users);

    res.json({message: "success", person: getById(users, req.body.id)});
});

app.get('/users/:id', parser, (req, res) => {
    const person = getById(users, req.params.id);
    if(!person){
        res.sendStatus(404);
    } else {
        res.status(200).json(person);
    }
});

app.delete('/users/:id', parser, (req, res) => {
    const person = removeEntryById(users, req.params.id);
    if(!person){
        res.sendStatus(404);
    } else {
        res.status(200).json({message: "removed", user: person});
    }
});

/*File system*/
const getUserData = () => {
    users = JSON.parse(fs.readFileSync('users.json'));
};

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync('users.json', stringifyData);
    getUserData();
};

/*Helper functions*/
const getById = (list, id) => {
    return list.find(item => item.id == id);
};

const removeEntryById = (list, id) => {
    const removed = list.splice(list.findIndex(item => item.id == id), 1);
    if (removed) saveUserData(users);
    return removed;
};

// FIXME: Apply this function
//   Also, what is this function meant for? removing empty objects from the list(array)?
const filterData = (data) => {
     return data.filter(function (el) {
        return el != null;
      });
};
