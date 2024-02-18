const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const rootSchema = require("./src/graphql/schema");
const rootResolver = require('./src/graphql/resolvers');
const isAuth = require("./src/middleware/isAuth");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorizarion');
//   if(req.method === 'OPTIONS') {
//     res.sendStatus(200)
//   }
//   next();
// });

app.use(cors());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: rootSchema,
    rootValue: rootResolver,
    graphiql: true
  })
);

// app.get("/", (req, res, next) => {
//   res.send("Welcome to node");
// });

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.96bvpab.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {

    app.listen(process.env.PORT);
    console.log(`Server started at port: ${process.env.PORT} and connected to database: ${process.env.MONGO_DB}`)

  })
  .catch((err) => {});


