var expect = require('chai').expect;
var Bacon = require('../');
var fs = require('fs');
var split = require('split');

var Readable = require('readable-stream').Readable;

var collect = function (observable) {
  var values = [];
  observable.onValue(function (value) {
    values.push(value);
  });
  return values;
};

describe('#Bacon.fromNodeStream', function () {

  it("should work for basic readable stream", function (done) {
    var nodeStream = new Readable({ objectMode: true });
    nodeStream.push(10);
    nodeStream.push(null);

    var eventStream = Bacon.fromNodeStream(nodeStream);
    eventStream.onValue(function (val) {
      expect(val).to.equal(10);
      done();
      return Bacon.noMore;
    });
  });

  it("should work for file stream split on lines", function (done) {
    var nodeStream = fs.createReadStream(
      __dirname + '/file.txt',
      { encoding: 'utf8' }
    );

    var eventStream = Bacon.fromNodeStream(nodeStream)
    .flatMap(function (str) {
      return Bacon.fromArray(str.split('\n'));
    })
    var lines = collect(eventStream);
    eventStream.onValue(function () {
      if (lines.length === 3) {
        expect(lines[0]).to.equal("i am a test file");
        expect(lines[1]).to.equal("hear me roar!");
        expect(lines[2]).to.equal("hehehehe. :)");
        done()
        return Bacon.noMore;
      }
    });
  });

  it("should work for line stream", function (done) {
    var nodeStream = fs.createReadStream(
      __dirname + '/file.txt',
      { encoding: 'utf8' }
    )
    .pipe(split());

    var eventStream = Bacon.fromNodeStream(nodeStream);
    var lines = collect(eventStream);
    eventStream.onValue(function () {
      if (lines.length === 3) {
        expect(lines[0]).to.equal("i am a test file");
        expect(lines[1]).to.equal("hear me roar!");
        expect(lines[2]).to.equal("hehehehe. :)");
        done()
        return Bacon.noMore;
      }
    });
  });
});