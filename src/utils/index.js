
/**
 * Filter out null or empty values from a JSON object.
 * 
 * @module FilterNullValuesJson
 * @param {Object} json - The JSON object to filter.
 * @returns {Object} A new JSON object with only non-null and non-empty values.
 */
module.exports.FilterNullValuesJson = async (json) => {
  const entries = Object.entries(json); // 1️
  const nonEmptyOrNull = entries.filter(
    ([key, val]) =>
      // key != 'updatedbylogo' &&
      // key != 'createdbylogo' &&
      val != "" &&
      val != null &&
      val != "null" &&
      val != undefined &&
      val != "undefined" &&
      typeof val != undefined &&
      typeof val != "undefined"
  ); // 2️
  const output = Object.fromEntries(nonEmptyOrNull); // 3
  return output;
};

/**
 * Formats the data and constructs a response object based on the input parameters.
 * 
 * @module FormateData
 * @param {any} data - The data to be formatted.
 * @param {string} [successmsg=''] - The success message to be included in the response.
 * @param {string} [errormsg=''] - The error message to be included in the response.
 * @param {string} [custmsg=''] - The custom message to be included in the response.
 * @param {number} limit - The limit for data loading.
 * @returns {Object} The formatted response object.
 */
module.exports.FormateData = async (data, successmsg = '', errormsg = '', custmsg = '', limit) => {
  let res = {};
  if (data.length != 0 && (!data.error)) {
    res.message = await this.ResponseMessage("success");
    res.data = data;
    if (limit) {
      res.loadmore = (data.length < limit) ? 0 : 1;
    }
    res.apistatus = true;
    res.statuscode = 200;
    if (successmsg != '') {
      res.message = successmsg;
    }
  } else if (data.error) {
    res.message = await this.ResponseMessage("error");
    res.data = [];
    res.apistatus = false;
    res.statuscode = 404;
  } else {
    res.message = await this.ResponseMessage("failed");
    res.data = [];
    res.apistatus = false;
    res.statuscode = 200;
    if (errormsg != '') {
      res.message = errormsg;
    }
  }
  if (custmsg != '') {
    res.message = custmsg;
  }
  return res;
};

/**
 * Returns a response message based on the message type provided.
 * 
 * @module ResponseMessage
 * @param {string} message_type - the type of message to retrieve
 * @returns {string} The corresponding message for the given message type
 */
module.exports.ResponseMessage = (message_type) => {
  try {
    const messages = {
      requirederror: "Please Provide All Required Field",
      datainsert: "Data Inserted",
      dataupdate: "Data Updated",
      datafound: "Data Found",
      nodatafound: "No Data Found",
      dataexist: "Data Exist",
      error: "Something went wrong",
      success: "Data found",
      failed: "No Data found",
    };
    return messages[message_type];
  } catch (error) {
    return error;
  }
};

/**
 * Get the API response object with the provided data, message, status code, and API status.
 * 
 * @module GetApiResponse
 * @param {object} data - The data to be included in the response.
 * @param {string} [message=""] - The message to be included in the response.
 * @param {number} [statuscode=200] - The status code of the response.
 * @param {boolean} [apistatus=true] - The API status indicating success or failure.
 * @returns {Promise<object>} The API response object.
 */
module.exports.GetApiResponse = async (
  { data, message = "", statuscode = 200, apistatus = true }
) => {
  try {
    if (data.length == 0) {
      var data = {
        success: apistatus,
        message: "Data Not found",
        data: [],
      };
    } else {
      var data = {
        success: apistatus,
        message: "Data Get Succesfully",
        data: data,
      };
    }
    if (message != "") data["message"] = message;
    if (statuscode != 200) data["success"] = apistatus;
    return await data;
  } catch (error) {
    return error;
  }
};

/**
 * Calculates the limit and skip values for pagination based on the given page and size.
 * If page or size is not provided or is empty, default values are used.
 * 
 * @module GetPagination
 * @param {number} page - The page number for pagination.
 * @param {number} size - The number of items per page.
 * @returns An object containing the limit and skip values for pagination.
 */
module.exports.GetPagination = async (page, size) => {
  if (page == undefined || page == "") {
    page = 1;
  } else {
    page = parseInt(page);
  }
  if (size == undefined || size == "") {
    size = 25;
  } else {
    size = parseInt(size);
  }
  skip = size * (page - 1);
  limit = size;
  return { limit, skip };
};

/**
 * Retrieves the sort by parameters from the request and returns an object with the column name and order.
 * 
 * @module GetSortByFromRequest
 * @param {string} orderbycolumnname - The name of the column to sort by.
 * @param {number} orderby - The order by which to sort (1 for ascending, -1 for descending).
 * @returns {object} An object containing the column name and order by parameters.
 * @throws {Error} If an error occurs during the process.
 */
module.exports.GetSortByFromRequest = async (orderbycolumnname, orderby) => {
  try {
    if (orderbycolumnname != undefined && orderby != undefined && orderbycolumnname != "" && orderby != "") {
      var columnname = orderbycolumnname;
      var orderby = orderby;
      sortarray = {
        [columnname]: +orderby,
      };
    } else {
      orderbycolumnname = "createdAt";
      orderby = -1;
    }
    return { orderbycolumnname, orderby };
  } catch (error) {
    return error;
  }
};

/**
 * Validates the signature in the request header and verifies it using JWT.
 * If the signature is valid, it sets the user payload in the request object.
 * 
 * @module ValidateSignature
 * @param {Object} req - The request object containing the signature in the "Authorization" header.
 * @returns {boolean} Returns true if the signature is valid and user payload is set, otherwise false.
 */
module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    var payload = jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {

    try {
      const signature = req.get("Authorization");
      var payload = jwt.verify(signature.split(" ")[1], APP_SECRET_SUPER_USER);
      return true;

    } catch (error) {

      return false;
    }
  }
};