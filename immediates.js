function setImmediates(outlib){
  if(!('clearImmediate' in this)){
    outlib.setImmediate = function(func){
      return setTimeout(func,0);
    };
    outlib.clearImmediate = function(c){
      clearTimeout(c);
    };
  }else{
    outlib.setImmediate = setImmediate;
    outlib.clearImmediate = clearImmediate;
  }
}

module.exports = setImmediates;
