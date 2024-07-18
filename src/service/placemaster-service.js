const { PlacemasterRepository } = require("../database");
const { ObjectId } = require('mongodb');
const utils = require('../utils')

/**
 * Handle Business Logic for Category
 * @class
 */
class PlaceMasterService {

  /**
   * Constructor function that initializes various repository instances and sets default response data.
   * @constructor
   */
  constructor() {
    this.repository = new PlacemasterRepository();
    this.resdata = {
      message: 'invalid Request',
      apistatus: false,
      statuscode: 400
    };
  }

  // Create Place Master
  /**
   * Asynchronously creates a place master record based on user inputs.
   * 
   * @async
   * @param {object} userInputs - An object containing user inputs for creating the place master.
   * @returns {object} - An object containing the response data after attempting to create the place master.
   */
  async CreatePlaceMaster(userInputs) {

    try {
      const { placename } = userInputs;
      var nameTrimed = placename.trim();
      const pipeline = [
        {
          $match: {
            placename: nameTrimed,
          },
        }
      ];
      const existingPlaceMaster = await this.repository.GetPipelineData(pipeline);

      if ((existingPlaceMaster.length == 0)) {
        const response = await this.repository.CreatePlaceMaster(userInputs);
        var successmsg = await utils.ResponseMessage("datainsert");
        var errormsg = await utils.ResponseMessage("nodatainsert");
        var apires = await utils.FormateData(response, successmsg, errormsg);
        return apires;
      } else if (existingPlaceMaster.error) {
        this.resdata.message = await utils.ResponseMessage("error");
        this.resdata.data = [];
        this.resdata.apistatus = false;
        this.resdata.statuscode = 404;
      } else {
        this.resdata.message = await utils.ResponseMessage("dataexist");
        this.resdata.statuscode = 409;
        this.resdata.data = [];
      }
      return this.resdata;

    } catch (err) {
      console.log({ error: err });
      return ({ error: err });
    }

  }
  // Create Place Master

  // Get Place Master List
  /**
   * Asynchronously retrieves data based on user inputs, including search criteria, date range, sorting options,
   * 
   * pagination, and number of items per page.
   * @async
   * @param {Object} userInputs - An object containing user input data such as search keywords, start date, end date,
   * sorting criteria, pagination details, and items per page.
   * @returns {Array} An array of formatted data based on the user inputs, or an empty array if no data is found.
   */
  async GetAllData(userInputs) {

    try {
      let { search, startdate, enddate, sortby, sortorder, nextpage, perpage } = userInputs;
      if (!search) { search = '' }
      var searchex = new RegExp(search.replace(/\+/g, ''), 'i');
      var { skip, limit } = await utils.GetPagination(nextpage, perpage);
      var { orderbycolumnname, orderby } = await utils.GetSortByFromRequest(sortby, +sortorder);
      var dateflt = [], fltand = [], fltsearch = [];
      fltand.push({ is_delete: { $ne: 1 } });

      if (startdate != undefined && enddate != undefined) {
        dateflt = { fltdate: { $gte: startdate, $lte: enddate }, };
      } else if (startdate != undefined) {
        dateflt = { fltdate: { $eq: startdate } };
      } else if (enddate != undefined) {
        dateflt = { fltdate: { $eq: enddate } };
      }
      if (searchex.length != 0) {
        fltsearch = {
          $or: [
            { placename: searchex },
            { countryname: searchex },
            { statename: searchex },
          ]
        }
        fltand.push(fltsearch);
      }
      if (dateflt.length != 0) {
        fltand.push(dateflt);
      }

      const pipeline = [
        {
          $addFields: {
            fltdate: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
          },
        },
        { $match: { $and: fltand }, },
        {
          $project: {
            status: 1,
            state_code: 1,
            placename: 1,
            countryid: 1,
            countryname: 1,
            country_code: 1,
            id: 1,
            stateid: 1,
            statename: 1,
          }
        },
        { $sort: { [orderbycolumnname]: +orderby } },
        { $skip: skip },
        { $limit: limit },
      ];

      const find = await this.repository.GetPipelineData(pipeline);
      var lodemore = 1
      if (find.length < limit) {
        lodemore = 0;
      }

      if (find) {
        var successmsg = await utils.ResponseMessage("datafound");
        var errormsg = await utils.ResponseMessage("nodatafound");
        var apires = await utils.FormateData({ data: find, lodemore: lodemore }, successmsg, errormsg);
        return apires;
      }
      return []
    } catch (err) {
      console.log({ error: err });
      return ({ error: err });
    }
  }
  // Get Place Master List

  // Update Place Master
  /**
   * Asynchronously updates the place master data based on the user inputs.
   * 
   * @async
   * @param {Object} userInputs - An object containing the id and placename to update.
   * @returns {Object} - Returns the updated place master data or an error object.
   */
  async UpdatePlaceMaster(userInputs) {

    try {

      const { id, placename } = userInputs
      var nameTrimed = placename.trim();
      var pipeline = [{ $match: { _id: new ObjectId(id) } }];
      var pipeline2 = [{ $match: { placename: nameTrimed, }, }];

      const existingPlaceMaster = await this.repository.GetPipelineData(pipeline)
      var existingPlaceMasterName = await this.repository.GetPipelineData(pipeline2);

      if (existingPlaceMasterName.length == 0) {
        existingPlaceMasterName = [];
      } else if (existingPlaceMasterName[0]._id == id) {
        existingPlaceMasterName = [];
      }

      if ((existingPlaceMaster.length != 0) && (existingPlaceMasterName.length == 0)) {
        const response = await this.repository.UpdatePlaceMaster(userInputs);
        var successmsg = await utils.ResponseMessage("dataupdate");
        var errormsg = await utils.ResponseMessage("nodataupdate");
        var apires = await utils.FormateData(response, successmsg, errormsg);
        return apires
      }
      else if (existingPlaceMaster.length == 0) {
        this.resdata.message = await utils.ResponseMessage("nodatafound");
        this.resdata.statuscode = 409;
        this.resdata.data = [];
      }
      else {
        this.resdata.message = await utils.ResponseMessage("dataexist");
        this.resdata.statuscode = 409;
        this.resdata.data = [];
      }
      return this.resdata;

    } catch (err) {
      console.log({ error: err });
      return ({ error: err });
    }

  }
  // Update Place Master

  // Search Place Master
  /**
   * Retrieves search data based on the provided place name.
   * 
   * @async
   * @param {Object} req - The request object containing the place name to search for.
   * @returns {Object} - The formatted response data based on the search results.
   * @throws {Error} - If an error occurs during the search process.
   */
  async GetSearchData(req) {
    try {

      const pipeline = [
        { $match: { placename: new RegExp(req.placename.trim(), "i") }, },
        { $project: { __v: 0, } }
      ];
      var response = await this.repository.GetPipelineData(pipeline);

      var successmsg = await utils.ResponseMessage("datafound");
      var errormsg = await utils.ResponseMessage("nodatafound");
      var apires = await utils.FormateData(response, successmsg, errormsg);
      return apires;
    } catch (err) {
      // throw new APIError('Data Not found', err)
      console.log({ error: err });
      return err;
    }
  }
  // Search Place Master

}

module.exports = PlaceMasterService;