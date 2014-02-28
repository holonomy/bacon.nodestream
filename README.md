# bacon.nodestream

a [node.js streams](https://github.com/substack/stream-handbook) plugin for bacon.js

## install

`npm install --save holonomy/bacon.nodestream`

## usage

```javascript
var fs = require('fs');
var split = require('split');
var Bacon = require('bacon.nodestream');

var nodeStream = fs.createReadStream(
  __dirname + '/test/file.txt',
  { encoding: 'utf8' }
)
.pipe(split());

Bacon.fromNodeStream(nodeStream)
.onValue(function (line) {
  // do something for each line
  console.log(line);
});
```

## test

`npm i && npm test`
