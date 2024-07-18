var { body } = require("express-validator");

const CreatePlaceMasterName = [
  body("placename")
    .notEmpty()
    .withMessage("Place Name is requires")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("invalid Place Name"),
  body("statename")
    .notEmpty()
    .withMessage("State Name is requires")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("invalid State Name"),
  body("countryname")
    .notEmpty()
    .withMessage("Country Name is requires")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("invalid Country Name"),
  body("status")
    .matches(/^(0|1)$/i)
    .withMessage("invalid Status"),


  body("createdby").notEmpty().withMessage("Please Provide Created By"),

  body("createdbyid")
    .notEmpty()
    .withMessage("Please Provide Created By ID"),
];

const UpdatePlaceMasterName = [
  body("id")
    .isMongoId()
    .withMessage("invalid ID"),
  body("placename")
    .notEmpty()
    .withMessage("Place Name is requires")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("invalid Place Name"),
  body("statename")
    .notEmpty()
    .withMessage("State Name is requires")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("invalid State Name"),
  body("countryname")
    .notEmpty()
    .withMessage("Country Name is requires")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("invalid Country Name"),
  body("status").matches(/^(0|1)$/i),

  body("updatedby").notEmpty().withMessage("Please Provide Updated By"),

  body("updatedbyid")
    .notEmpty()
    .withMessage("Please Provide Updated By ID"),
];

const SearchPlaceMasterWithName = [
  body("placename")
    .notEmpty()
    .withMessage("Place Name is requires")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("invalid Place Name"),
];

module.exports = {
  CreatePlaceMasterName,
  SearchPlaceMasterWithName,
  UpdatePlaceMasterName,
};
