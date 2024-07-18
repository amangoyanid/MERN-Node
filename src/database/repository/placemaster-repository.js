const mongoose = require("mongoose");
const { PlaceMaster } = require("../model");

const { error } = require("console");
const utils = require("../../utils");

/**
 * Handle Database Logic for Category
 * @class
 */
class PlaceRepository {

  /**
   * Creates a new PlaceMaster record based on the provided request data.
   * 
   * @async
   * @param {Object} req - The request object containing data for the new PlaceMaster record.
   * @returns {Promise<Object>} A Promise that resolves to the result of saving the new PlaceMaster record.
   * If an error occurs during the process, it is caught and logged, and an error object is returned.
   */
  async CreatePlaceMaster(req) {
    try {
      const cmaster = new PlaceMaster(req);
      const cmasterResult = await cmaster.save();
      return cmasterResult;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }

  /**
   * Retrieves pipeline data from the PlaceMaster collection using the provided pipeline.
   * 
   * @async
   * @param {Object[]} pipeline - The pipeline to be used for aggregation.
   * @returns {Object[]} - An array of data retrieved from the PlaceMaster collection based on the pipeline.
   * If no data is found, an empty array is returned.
   * If an error occurs during the process, an object with an 'error' key is returned.
   */
  async GetPipelineData(pipeline) {
    try {

      const data = await PlaceMaster.aggregate(pipeline);

      return (data) ? data : []
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }

  /**
   * Updates a place master record in the database based on the provided user inputs.
   * 
   * @async
   * @param {Object} userInputs - An object containing the user inputs for updating the place master record.
   * @returns {Object} - The updated place master record.
   * @throws {Error} - If an error occurs during the update process.
   */
  async UpdatePlaceMaster(userInputs) {
    const { id } = userInputs;
    const output = await utils.FilterNullValuesJson(userInputs);

    try {

      const updatedmaster = await PlaceMaster.findByIdAndUpdate(id, output, { new: true });
      return updatedmaster;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }

}

module.exports = PlaceRepository;
