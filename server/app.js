require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const corsOptions = {
//   origin:'http://localhost:3000',credentials:true,     // access-control-allow-credentials:true
//   optionSuccessStatus:200
// }

const helmet = require("helmet");
const morgan = require("morgan");

const port = process.env.PORT || 3001;

const app = express();

// -------------- API security --------------------------
// app.use(helmet());

// -------------- Handle CORS error ---------------------
app.use(cors());

// -------------- MongoDB connection setup --------------
const mongoose = require("mongoose");
const MONGO_URL = "mongodb+srv://Jackal:Yoshi1988@mernstack.3vtaj.mongodb.net/TikkitIssueTracking"
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const mDb = mongoose.connection;
  mDb.on("open", () => {
    console.log("MongoDB is connected");
  });

  mDb.on("error", (error) => {
    console.log(error);
  });

  //Logger
  app.use(morgan("tiny"));
}

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/client/build')))

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
//   })
// }

// -------------- Set bodyParser ------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -------------- PORT to use ---------------------------


// -------------- Load routers --------------------------
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
const tokensRouter = require("./src/routers/tokens.router");



// -------------- Use routers ---------------------------
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);

// const path = require('path')

// if (process.env.NODE_ENV === 'production') {
//   app.use('/', express.static('client/build'))

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client/build/index.html'))
//   })
// }
app.get('/', (req, res) => {
  res.send('App is running!')
}))

// -------------- Error handler -------------------------
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`);
});