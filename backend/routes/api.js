"use strict";

var express = require("express");
var router = express.Router();

var db = require("./db");

router.get("/rappers", function(req, res) {
	db("rappers").then(function(data){
		res.json(data);
	}, function(err){
		res.send(err);
	});
});

module.exports = router;