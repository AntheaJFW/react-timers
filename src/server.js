const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 4001;

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.get('/tasks', (req, res) => {
    fs.readFile('tasks.json', (err, data) => {
        if (err) {
            console.log('ERROR, returning default');
            return res.send([{
                task: "New Timer",
                isStarted: false,
                seconds: 0,
                comment: ''
              },
              {
                task: "Another new timer",
                isStarted: false,
                seconds: 0,
                comment: ''
              },
              {
                task: "Another 'nother new timer",
                isStarted: false,
                seconds: 0,
                comment: ''
              }]);
        }

        let contents = JSON.parse(data);
        console.log(contents);
        res.send(contents);
    })
})

app.post('/tasks', (req, res) => {
    fs.writeFile('tasks.json', JSON.stringify(req.body), (err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    })
})

app.listen(port)

console.log('App is listening on port ' + port);