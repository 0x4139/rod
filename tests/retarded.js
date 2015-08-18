'use strict';
var rod = require('./../index');

rod('http://0x4139.com', function (err, res) {
    if (err) {
        throw err
    }
    console.log(res.statusCode); // 200
    res.pipe(process.stdout); // `res` is a stream
});