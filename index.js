function createTimeoutLib(isFunction, Fifo, nowlib) {
  var ret = {};
  require('./immediates')(ret);
  require('./next')(isFunction, Fifo, nowlib, ret);

  return ret;
};

module.exports = createTimeoutLib;
