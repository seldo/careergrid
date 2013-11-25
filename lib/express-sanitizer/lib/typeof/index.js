module.exports = function(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (Object.prototype.toString.call(value) == '[object Array]') {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}