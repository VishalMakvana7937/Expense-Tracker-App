require('dotenv').config();
const express = require('express');
const connectDB = require('./db/db');
const router = require('./routes/Authroute');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
}

app.use(cors(corsOptions));

app.use(express.json());
app.use("/", router); 

// app.get("/", (req, res) => {
//   app.use(express.static(path.resolve(__dirname, "client", "build")));
//   res.sendFile(path.resolve(__dirname, "clint", "build", "index.html"));
// });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database', err);
});

module.exports = app;
