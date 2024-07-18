const { validationResult } = require("express-validator");
const { CreatePlaceMasterName, UpdatePlaceMasterName } = require("../route/placemaster-validator.js");
const PlaceMasterService = require("../service/placemaster-service.js");
const utils = require('../utils');
const { UserAuth } = require('./middlewares/auth.js')

module.exports = (app) => {
  const service = new PlaceMasterService();
  let apiresponse = { statuscode: 400, message: "Bad Request", data: [], apistatus: false };

  // Create Place Master
  app.post("/mern/placemaster/create", UserAuth, CreatePlaceMasterName, async (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        apiresponse.message = await utils.ResponseMessage("requirederror");
        apiresponse.data = errors.array();
        apiresponse.statuscode = 400
        console.log(errors);
      }
      else {
        apiresponse = await service.CreatePlaceMaster(req.body);
        // console.log(apiresponse);
      }
      var response = await utils.GetApiResponse(apiresponse);

      return res.status(apiresponse.statuscode).json(response);

    } catch (err) {
      console.log(err);
      res.json(err)
      next(err);
    }
  });
  // Create Place Master

  // Get Place Master List
  app.get("/mern/placemaster", UserAuth, async (req, res, next) => {
    try {
      var userInputs = req.body
      const apires = await service.GetAllData(userInputs);
      var lodemore = apires.data.lodemore

      apiresponse.data = apires.data.data
      apiresponse.message = apires.message;
      apiresponse.apistatus = apires.apistatus;
      statuscode = apires.statuscode;

      var response = await utils.GetApiResponse(apiresponse);
      response.lodemore = lodemore;

      return res.status(statuscode).json(response);

    } catch (err) {
      console.log(err);
      res.json(err)
      next(err);
    }
  });
  // Get Place Master List

  // Update Place Master
  app.put("/mern/placemaster/update", UserAuth, UpdatePlaceMasterName, async (req, res, next) => {
    const errors = validationResult(req);

    try {
      if (!errors.isEmpty()) {
        apiresponse.message = await utils.ResponseMessage("requirederror");
        apiresponse.data = errors.array();
        apiresponse.statuscode = 400
        console.log(errors);
      }
      else {
        apiresponse = await service.UpdatePlaceMaster(req.body);
      }
      var response = await utils.GetApiResponse(apiresponse);

      return res.status(apiresponse.statuscode).json(response);
    } catch (err) {
      res.status(200).json(err);
    }
  });
  // Update Place Master

  // Search Place Master
  app.get("/mern/placemaster/search", UserAuth, async (req, res, next) => {
    try {
      const apires = await service.GetSearchData(req.body);

      apiresponse.data = apires.data
      apiresponse.message = apires.message;
      apiresponse.apistatus = apires.apistatus;
      statuscode = apires.statuscode;

      var response = await utils.GetApiResponse(apiresponse);

      return res.status(statuscode).json(response);

    } catch (err) {
      console.log(err);
      next(err);
    }
  });
  // Search Place Master

};
