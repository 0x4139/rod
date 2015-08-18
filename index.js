'use strict';
module.exports = rod;

var http = require('http');
var https = require('https');
var url = require('url');
var unzipResponse = require('unzip-response');
var objectAssign = require('object-assign');

function rod(opts, cb) { // can the callback be called more than once here?
    if (typeof opts === 'string') {
        opts = {url: opts}
    } else {
        objectAssign({}, opts);
    }
    if (opts.url) {
        parseOptsUrl(opts);
    }
    if (opts.headers == null) {
        opts.headers = {};
    }
    if (opts.maxRedirects == null) {
        opts.maxRedirects = 10;
    }

    var body = opts.body;
    opts.body = undefined;
    if (body && !opts.method) {
        opts.method = 'POST';
    }

    var customAcceptEncoding = Object.keys(opts.headers).some(function (h) {
        return h.toLowerCase() === 'accept-encoding'
    });

    if (!customAcceptEncoding) {
        opts.headers['accept-encoding'] = 'gzip, deflate'
    }

    var protocol;
    if (opts.protocol === 'https:') {
        protocol = https;
    }
    else {
        protocol = http;
    }
    var req = protocol.request(opts, function (res) {
        if (res.statusCode >= 300 && res.statusCode < 400 && 'location' in res.headers) {
            opts.url = res.headers.location;
            parseOptsUrl(opts);
            res.resume();

            opts.maxRedirects -= 1;
            if (opts.maxRedirects > 0) {
                rod(opts, cb);
            }
            else cb(new Error('too many redirects'));

            return
        }

        cb(null, typeof unzipResponse === 'function' ? unzipResponse(res) : res)
    });
    req.on('error', cb);
    req.end(body);
    return req
}

function parseOptsUrl(opts) {
    var loc = url.parse(opts.url);
    if (loc.hostname)
        opts.hostname = loc.hostname;
    if (loc.port)
        opts.port = loc.port;
    if (loc.protocol)
        opts.protocol = loc.protocol;
    opts.path =
        loc.path;
    delete opts.url
}