function createTimeoutLib(isFunction, Fifo) {
  var ret = {};
  require('./immediates')(ret);
  require('./next')(isFunction, Fifo, ret);

  return ret;
};

module.exports = createTimeoutLib;
