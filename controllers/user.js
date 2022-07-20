const User = require('../models/user');

exports.create_user = function (req, res) {
    User.find({"username": req.body.username}, (err, userData) => {
        if (err) console.log(`Error with server ${err}`);
        else {
            if (userData.length === 0) {
                const newUser = new User({
                    "_id": req.body.id,
                    "username": req.body.username
                });

                newUser.save((err, data) => {
                    if (err) console.log(`Error saving data=> ${err}`);
                    else res.json({
                        "_id": data.id,
                        "username": data.username
                    })
                });
            } else {
                res.writeHead(404, {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                });

                res.end("Username already Exists", err);
            }
        }
    });
};

exports.get_users = function (req, res) {
    User.find({}, (err, data) => {
        if (err || data.length === 0) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(err));
        }
        else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
        }
    });
};