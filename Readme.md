# rod

## features

This module is designed to be the lightest possible wrapper on top of node.js `http`, but supporting:

- follows redirects
- automatically handles gzip/deflate responses
- supports HTTPS

## install

```
npm install rod
```

## usage

### simple GET request


```js
'use strict';
var rod = require('./../index');

rod('http://0x4139.com', function (err, res) {
    if (err) {
        throw err
    }
    console.log(res.statusCode);
    res.pipe(process.stdout);
});
```

## license

MIT. Copyright @ Vali Malinoiu