var express = require('express');
var session = require('express-session')
var CryptoJS = require('crypto-js');
var aws = require('aws-sdk');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var config = require('./src/config');
var massiveInstance = massive.connectSync({connectionString: config.connString});

var app = module.exports = express();
const clientSecretKey = config.secretKey;
const serverPublicKey = config.accessKey;
const serverSecretKey = config.secretKey;
const expectedBucket = 'canje';
const expectedHostname = 'http://canje.s3.amazonaws.com';
const expectedMinSize = 0;
const expectedMaxSize = null;
var s3

aws.config.update({
    accessKeyId: serverPublicKey,
    secretAccessKey: serverSecretKey
});
s3 = new aws.S3()

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitalized: false
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}))
app.set('db', massiveInstance);

app.use(express.static(__dirname + '/build'))
var db = app.get('db');
var controller = require('./controller.js');
var imageInfo = {}
app.post("/s3handler", function(req, res) {
    if (typeof req.query.success !== "undefined") {
      //Save to db
      // Send back 200.
      imageInfo = req.body
      console.log(req.session)
      res.status(200).send('item saved')
        // verifyFileInS3(req, res);
    }
    else {
        signRequest(req, res);
    }
});

app.post('/api/profile/addItem', function(req, res, next){
  console.log(req.body)
  var itemimageurl = `https://s3-us-west-1.amazonaws.com/canje/${imageInfo.key}`
  console.log()
  db.add_item([req.body.userID, req.body.name, req.body.description, itemimageurl, req.body.category, req.body.timestamp], function(err, item){
    console.log(err)
  res.status(200).send('Item Added')
  })
})

app.post('/api/items', controller.addItem)

app.get('/api/items', controller.getItems)

app.get('/api/profile/item', controller.getItem)

app.put('/api/profile/toggleItemAvalibility', controller.toggleItemAvalibility)

app.delete('/api/profile/item', controller.deleteItem)

app.post('/api/offers', controller.addOffer)

app.get('/api/offers', controller.getOffers)

app.get('/api/profile/check', controller.profileExsists)

app.post('/api/profile/new', controller.newUser);

app.put('/api/profile/update', controller.updateUser)

app.delete('/api/offers/delete', controller.removeOffer)

app.get('/api/users', controller.getUser)

app.get('/api/offers/check', controller.checkOffers)

app.put('/api/offers', controller.markAsSeen)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen('1138', function(){
  console.log("Successfully listening on : 1138")
})

function signRequest(req, res) {
    if (req.body.headers) {
        signRestRequest(req, res);
    }
    else {
        signPolicy(req, res);
    }
}

// Signs multipart (chunked) requests.  Omit if you don't want to support chunking.
function signRestRequest(req, res) {
    var version = req.query.v4 ? 4 : 2,
        stringToSign = req.body.headers,
        signature = version === 4 ? signV4RestRequest(stringToSign) : signV2RestRequest(stringToSign);

    var jsonResponse = {
        signature: signature
    };

    res.setHeader("Content-Type", "application/json");

    if (isValidRestRequest(stringToSign, version)) {
        res.end(JSON.stringify(jsonResponse));
    }
    else {
        res.status(400);
        res.end(JSON.stringify({invalid: true}));
    }
}

function signV2RestRequest(headersStr) {
    return getV2SignatureKey(clientSecretKey, headersStr);
}

function signV4RestRequest(headersStr) {
    var matches = /.+\n.+\n(\d+)\/(.+)\/s3\/aws4_request\n([\s\S]+)/.exec(headersStr),
        hashedCanonicalRequest = CryptoJS.SHA256(matches[3]),
        stringToSign = headersStr.replace(/(.+s3\/aws4_request\n)[\s\S]+/, '$1' + hashedCanonicalRequest);

    return getV4SignatureKey(clientSecretKey, matches[1], matches[2], "s3", stringToSign);
}

// Signs "simple" (non-chunked) upload requests.
function signPolicy(req, res) {
    var policy = req.body,
        base64Policy = new Buffer(JSON.stringify(policy)).toString("base64"),
        signature = req.query.v4 ? signV4Policy(policy, base64Policy) : signV2Policy(base64Policy);

    var jsonResponse = {
        policy: base64Policy,
        signature: signature
    };

    res.setHeader("Content-Type", "application/json");

    if (isPolicyValid(req.body)) {
        res.end(JSON.stringify(jsonResponse));
    }
    else {
        res.status(400);
        res.end(JSON.stringify({invalid: true}));
    }
}

function signV2Policy(base64Policy) {
    return getV2SignatureKey(clientSecretKey, base64Policy);
}

function signV4Policy(policy, base64Policy) {
    var conditions = policy.conditions,
        credentialCondition;

    for (var i = 0; i < conditions.length; i++) {
        credentialCondition = conditions[i]["x-amz-credential"];
        if (credentialCondition != null) {
            break;
        }
    }

    var matches = /.+\/(.+)\/(.+)\/s3\/aws4_request/.exec(credentialCondition);
    return getV4SignatureKey(clientSecretKey, matches[1], matches[2], "s3", base64Policy);
}

// Ensures the REST request is targeting the correct bucket.
// Omit if you don't want to support chunking.
function isValidRestRequest(headerStr, version) {
    if (version === 4) {
        return new RegExp("host:" + expectedHostname).exec(headerStr) != null;
    }

    return new RegExp("\/" + expectedBucket + "\/.+$").exec(headerStr) != null;
}

// Ensures the policy document associated with a "simple" (non-chunked) request is
// targeting the correct bucket and the min/max-size is as expected.
// Comment out the expectedMaxSize and expectedMinSize variables near
// the top of this file to disable size validation on the policy document.
function isPolicyValid(policy) {
    var bucket, parsedMaxSize, parsedMinSize, isValid;
    if (!policy.conditions) return;
    policy.conditions.forEach(function(condition) {
        if (condition.bucket) {
            bucket = condition.bucket;
        }
        else if (condition instanceof Array && condition[0] === "content-length-range") {
            parsedMinSize = condition[1];
            parsedMaxSize = condition[2];
        }
    });

    isValid = bucket === expectedBucket;

    // If expectedMinSize and expectedMax size are not null (see above), then
    // ensure that the client and server have agreed upon the exact same
    // values.
    if (expectedMinSize != null && expectedMaxSize != null) {
        isValid = isValid && (parsedMinSize === expectedMinSize.toString())
            && (parsedMaxSize === expectedMaxSize.toString());
    }

    return isValid;
}

// After the file is in S3, make sure it isn't too big.
// Omit if you don't have a max file size, or add more logic as required.
function verifyFileInS3(req, res) {
    function headReceived(err, data) {
        if (err) {
            res.status(500);
            console.log(err);
            res.end(JSON.stringify({error: "Problem querying S3!"}));
        }
        else if (data.ContentLength > expectedMaxSize) {
            res.status(400);
            res.write(JSON.stringify({error: "Too big!"}));
            deleteFile(req.body.bucket, req.body.key, function(err) {
                if (err) {
                    console.log("Couldn't delete invalid file!");
                }

                res.end();
            });
        }
        else {
            res.end();
        }
    }
    console.log(req.body);
    callS3("head", {
        Bucket: req.body.bucket,
        Key: req.body.key
    }, headReceived);
}

function getV2SignatureKey(key, stringToSign) {
    var words = CryptoJS.HmacSHA1(stringToSign, key);
    return CryptoJS.enc.Base64.stringify(words);
}

function getV4SignatureKey(key, dateStamp, regionName, serviceName, stringToSign) {
    var kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key),
        kRegion = CryptoJS.HmacSHA256(regionName, kDate),
        kService = CryptoJS.HmacSHA256(serviceName, kRegion),
        kSigning = CryptoJS.HmacSHA256("aws4_request", kService);

    return CryptoJS.HmacSHA256(stringToSign, kSigning).toString();
}

function deleteFile(bucket, key, callback) {
    callS3("delete", {
        bucket: bucket,
        key: key
    }, callback);
}

function callS3(type, spec, callback) {
    s3[type + "Object"]({
        Bucket: spec.bucket,
        Key: spec.key
    }, callback)
}
