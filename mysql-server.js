const express = require('express');
const app = express();
const http = require("http");
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const tm = require( 'text-miner');

const port = process.env.PORT || 4000;

// const server = http.createServer(app);

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on('connection', (socket) => {
//   console.log("Socket Connected");
//   socket.on("data-logs", (data) => {
//     console.log("=== creating stream ===");
//     fs.createReadStream('file.txt')
//     .on('data', (chunk) => {
//       const lines = chunk.toString().split('\n');
//       for (let i = 0; i < 10; i++) {
//         setTimeout(() => {
//           console.log('Lines streamed: ', i+1);
//           socket.emit('data-logs', { a: lines[i], b: i + 1});
//         }, i * data);
//       }
//     });

    
//     socket.on("analysis", (d) => {
//         console.log("=== analysis requested ===");
//         const my_corpus = new tm.Corpus();
//         my_corpus.addDoc(d);
//         const terms = new tm.DocumentTermMatrix( my_corpus );
//         const res = terms.findFreqTerms(1);
//         console.log('Data Analysed Successfully!'); 
//         socket.emit('analysis', res);
//     });

//   });

//     socket.on("disconnect", () => {
//       console.log("user disconnected");
//     });
// });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.post('/api/login', (req, res) => {
//     const { loginUser, loginPass } = req.body;
//     console.log(`User logging in: ${loginUser}`); 
//     connection.connect((error) => {
  //       if(error) {
//         console.log('Error connecting: ' + error.message);
//         return;
//     }
//     console.log('Connection: Established sucessfully'); 
//     });
//     connection.query("SELECT * from users", function (err, result) {
//         if (err) {
  //             console.log('Error on query: ' + err.message);
//             return;
//         }
//         console.log("Query: Successful");
//         const records = result;
//         const recordsSearch = records.find(item => item.username === loginUser && item.password === loginPass);
//         let ans = false;
//         if (recordsSearch) ans = true;
//         console.log("Authentication: Complete!")
//         res.send(ans);
//       });
// })

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
    res.send('Connection: Established sucessfully');
  })

  });

//   const dBQuery = "INSERT INTO users (username, email, password, confirm_pass) VALUES ?";
//   const values = [[`${userName}`,`${email}`, `${passWord}`, `${confirmPassword}`]];

//   connection.query(dBQuery, [values], function (err, result) {
//     if (err) {
//         console.log('Error on query: ' + err.message);
//         return;
//     }
//     // console.log("Query: Successful" + result.affectedRows);
//     console.log("Query: Successful! New user created.");
//   });

//   return res.send('API Successful');
// });

app.listen(port, () => {
  console.log(`App started on port: ${port}`)
})

// server.listen(3054, () => {
//   console.log(`Socket port: ${3054}`)
// })
