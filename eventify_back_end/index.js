const connect_to_db = require("./db/db");
const express = require('express')
var cors = require('cors')

connect_to_db();

const app = express()

app.use(cors())

// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// };

// app.use(cors(corsOptions)); // Apply CORS configuration

const port = process.env.PORT || 5000;

// app.use(express.json())// to use req.body we need to use the express.json middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));


// now we are gona use routes
app.use("/api/auth" , require("./routes/auth"))
app.use("/api/event" , require("./routes/event"))
app.use("/api/user" , require("./routes/profile"))
app.use("/api/startup" , require("./routes/startup"))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
     
console.log("we are in index.js");