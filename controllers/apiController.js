var bodyParser = require('body-parser');
//var imagefileController = require('./imagefileController');

var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');

var Images = require('../models/imageModel');

// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});

module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    //URL : http://localhost:3010/images/
    // To get all the images/files stored in MongoDB
    app.get('/api/images', function (req, resp) {

        Images.find({}, function (err, images) {
            if (err)
                throw err;

            var template = '';
            if (images.length > 0)
                images.forEach(function (value) {
                    template = `${template} <img style="width:250px;height:250px" src="../../assets/${value._doc.originalname}"><br><br>`;
                });
            else
                template = `<h1>No images uploaded</h1>`;

            //resp.send(images);
            resp.send(template);
        });
    });

    // URL : http://localhost:3010/images/(give you collectionID)
    // To get the single image/File using id from the MongoDB
    app.get('/api/images/:id', function (req, resp) {

        Images.find({
            _id: req.params.id
        }, function (err, image) {
            if (err)
                throw err;

            resp.send(`<img style="width:250px;height:250px" src="../../assets/${image[0]._doc.originalname}">'`);
            //resp.render('viewimage.ejs', { serverimage: image });
        });
    });


    app.get('/', function (req, resp, next) {
        resp.render('index.ejs');
    });

    app.post('/', upload.any(), function (req, resp, next) {

        //resp.send(req.files);

        /*req.files has the information regarding the file you are uploading...
        from the total information, i am just using the path and the imageName to store in the mongo collection(table)
        */
        var path = req.files[0].path;
        var imageName = req.files[0].originalname;

        var imagepath = {};
        imagepath['path'] = path;
        imagepath['originalname'] = imageName;

        Images.create(imagepath, function (err, next) {
            if (err) {
                next(err);
            } else {
                resp.send('Image Uploaded.');
            }
        });

        // upload.save(function (err) {
        //     if (err) throw err;

        //     resp.send('Image Uploaded.');
        // });

    });
}