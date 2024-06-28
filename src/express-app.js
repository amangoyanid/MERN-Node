const express = require('express');
// const {} = require('./src/api');


module.exports = async (app) => {

    // app.use(express.json({ limit: '1mb'}));
    // app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    // app.use(cors());
    // app.use(express.static(__dirname + '/public'))
    app.use(express.json())

    //api

    // error handling
    // app.use(HandleErrors);

};