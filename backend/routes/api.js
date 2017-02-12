"use strict";

var express = require("express");
var router = express.Router();
var async = require("async");
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

router.get("/rappers_name", function(req, res) {
	async.parallel({
		name: function(callback) {
			s3.listObjects({Bucket: "raplibs4"}, 	function(err, data){
				var set = new Set();
			  if (err) {
			    return res.send(err);
			  }
		    for(var i = 0; i < data.Contents.length; i++) {
		      var key = JSON.stringify(data.Contents[i].Key);
		      var name = key.split("/")[0].slice(1);
		      set.add(name);
		    }
		    callback(null, Array.from(set));
			});			
		}
	}, function(err, results) {
		res.json({
			names: results.name
		})
	});
});

router.get("/rappers_info/:name", function(req, res) {
	var rapperName = req.params.name;
	async.parallel({
		img: function(callback) {
			s3.listObjects({Bucket: "raplibs4"}, 	function(err, data){
				var image = null;
			  if (err) {
			    return res.send(err);
			  }
		    for(var i = 0; i < data.Contents.length; i++) {
		      data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
		      var key = JSON.stringify(data.Contents[i].Key);
		      var name = key.split("/")[0].slice(1);
		      var file = key.split("/")[1].replace('"', '');
		      if(name === rapperName) {
		      	var fileParts = file.split(".");
		      	if(fileParts[1] === "png") {
		      		image = data.Contents[i].Url;
		      	}
		      }
		    }
		    callback(null, image);
			});			
		},
		line: function(callback) {
			s3.listObjects({Bucket: "raplibs4"}, 	function(err, data){
				var lines = [];
			  if (err) {
			    return res.send(err);
			  }
		    for(var i = 0; i < data.Contents.length; i++) {
		      data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
		      var key = JSON.stringify(data.Contents[i].Key);
		      var name = key.split("/")[0].slice(1);
		      var file = key.split("/")[1].replace('"', '');
		      if(name === rapperName) {
		      	var fileParts = file.split(".");
		      	if(fileParts[1] === "mp3"){
		      		lines.push({
		      			line:fileParts[0],
		      			sound_src: data.Contents[i].Url
		      		});
		      	}
		      }
		    }
		    callback(null, lines);
			});			
		}
	}, function(err, results) {
		res.json({ 
			img_src: results.img,
			lines: results.line
		});
	});
});

module.exports = router;