const express = require('express');
const app = express();
// const http = require("http");
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
// const fs = require('fs');
// const tm = require( 'text-miner');

const port = process.env.PORT || 4120;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/sqlconnection', function (req, res) {
  const { host, user, password, database } = req.body;
  console.log('User Details: ', req.body);
  const connection = mysql.createConnection({
    user: user,
    host: host,
    password: password,
    database: database,
    insecureAuth : true,
  });
  connection.connect((error) => {
    if(error) {
      console.log('Error connecting: ' + error.message);
      return;
    }
    console.log('Connection: Established sucessfully'); 
    // res.send('Connection: Established sucessfully');
  })
  connection.query("SELECT event_time, user_host, server_id, command_type FROM general_log WHERE command_type='Query' LIMIT 15", function (err, result) {
    if (err) {
        console.log('Error on query: ' + err.message);
        return;
        }
      console.log("Query: Successful");
      const records = result;
      console.log('# of records: ', records.length);
      res.send(records);
})
  });

app.listen(port, () => {
  console.log(`App started on port: ${port}`)
})