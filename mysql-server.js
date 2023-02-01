const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
// const spawn = require('child_process').spawn;
// const { exec } = require('child_process');
let records;
const server = http.createServer(app);
const port = process.env.PORT || 4120;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log("Socket Connected");

  socket.on("mysql-logs", (data) => {
    console.log("=== creating stream ===");
    // .on('data', (chunk) => {
    //   const lines = chunk.toString().split('\n').slice(-10);
    //   // console.log(lines)
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        console.log(typeof records)
        //if (records) 
        socket.emit('mysql-logs', records[i]);
        }, i * 1500);
      }
  });
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
    });

  });
  
  // fs.watch('/var/log/syslog', (eventType, filename) => {
  //   if (eventType === 'change') {
  //     console.log(`File ${filename} was changed!`);
  //     exec('tail -n 1 /var/log/syslog', (err, stdout, stderr) => {
  //       if (err) {
  //         console.error(err);
  //         return;
  //       }
  //       // console.log(stdout);
  //       socket.emit('linux-logs', { lineData: stdout, lineNum: 0});
  //     });
  //   }
  // });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/sqlconnection', function (req, res) {
  const { host, user, password, database } = req.body;
  // console.log('User Details: ', req.body);
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
  connection.query("SELECT event_time, user_host, server_id, command_type FROM general_log LIMIT 15", function (err, result) {
    if (err) {
        console.log('Error on query: ' + err.message);
        return;
        }
      console.log("Query: Successful");
      records = result;
      console.log('# of records: ', records.length);
      res.send(records);
})
  });

app.listen(port, () => {
  console.log(`App started on port: ${port}`)
})

server.listen(port+10, () => {
  console.log(`Socket port: ${port+10}`)
})
