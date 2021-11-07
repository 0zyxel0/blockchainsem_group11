const mongoose = require("mongoose");
const logger = require("../logger");
require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 * DB_STRING_PROD=<your production database string>
 */

/* Mongodb database connection string. change it as per your needs. here "mydb" is the name of the database.
 *  You don't need to create DB from mongodb terminal. mongoose create the db automatically.
 */
const db = mongoose.connection;

if (!process.env.NODE_ENV) {
  logger.info(
    `Environment is Incorrectly Declared. Env settings added ${process.env.NODE_ENV}`
  );
}

// Connect to the correct environment database
if (process.env.NODE_ENV === "prod") {
  const uri =
    "mongodb+srv://" +
    process.env.ATLAS_USER_PROD +
    ":" +
    process.env.ATLAS_PASS_PROD +
    "@" +
    process.env.ATLAS_CLUSTER_PROD +
    "/" +
    process.env.ATLAS_DB_PROD +
    "?retryWrites=true&w=majority";

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function callback() {
    logger.info("Successfully Connected To MongoDB Production...");
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", function() {
    mongoose.connection.close(function() {
      logger.info(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });
} else {
  const uri =
    "mongodb+srv://" +
    process.env.ATLAS_USER_DEV +
    ":" +
    process.env.ATLAS_PASS_DEV +
    "@" +
    process.env.ATLAS_CLUSTER_DEV +
    "/" +
    process.env.ATLAS_DB_DEV +
    "?retryWrites=true&w=majority";

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function callback() {
    logger.info("Successfully Connected To MongoDB Development...");
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", function() {
    mongoose.connection.close(function() {
      logger.info(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });
}

module.exports = db;
