const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
// const errorHandler = require("./utils/errors");
// const cors = require("cors");

const StartServer = async () => {
  const app = express();
  await databaseConnection();
  await expressApp(app);
  // await errorHandler(app);
  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  }).on("error", (err) => {
    console.log(err);
    process.exit();
  });
};

StartServer();