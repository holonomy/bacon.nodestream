var Bacon = require('baconjs');

Bacon.fromNodeStream = function (stream) {
  return Bacon.fromBinder(function (sink) {

    var listeners = {}
    var addListener = function (ev, listener) {
      listeners[ev] = listener;
      stream.on(ev, listener);
    }

    addListener("data", function (data) {
      sink(data);
    });
    addListener("end", function () {
      sink(new Bacon.End());
    });
    addListener("error", function (err) {
      sink(new Bacon.Error(err));
    });

    return function unsubscribe () {
      for (var ev in listeners) {
        stream.removeListener(ev, listeners[ev]);
      }
    };
  });
};

module.exports = Bacon;