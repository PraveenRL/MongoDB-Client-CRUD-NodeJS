const express = require('express');
const bill = express();
var fs = require('fs');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

bill.use(bodyParser.json());
bill.post('/bill', postBill);
bill.get('/bill', getBill);
bill.get('/bill/:id', getBill);
bill.put('/bill/:id', putBill);
bill.delete('/bill/:id', deleteBill);

var dbo = ''
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("mydb");
    dbo.createCollection("order", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
    })
})

function postBill(req, res) {
    dbo.collection("order").insertOne(req.body, function (err, data) {
        if (err) throw err;
        console.log("1 document inserted");
        res.send(data)
    })
}

var ObjectId = require('mongodb').ObjectID;
function getBill(req, res) {
    var id = req.params.id;
    if (!id) {
        dbo.collection("order").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    }
    else{
            let id = {_id: new ObjectId(req.params.id)}
            dbo.collection("order").findOne(id, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.send(result);
        })
    }
}

function putBill(req, res) {
    let id = {_id: new ObjectId(req.params.id)}
    var newvalues = { $set: req.body };
    dbo.collection("order").updateOne(id, newvalues, function (err, data) {
        if (err) throw err;
        console.log("1 document updated");
        res.send(data);
    });
}

function deleteBill(req, res) {
    let id = {_id: new ObjectId(req.params.id)}
    dbo.collection("order").deleteOne(id, function (err, data) {
        if (err) throw err;
        console.log("1 document deleted");
        res.send(data)
    });
}

bill.listen(3000, function () {
    console.log('Bill running...!');
})