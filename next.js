function augmentWithNext(isFunction, Fifo, outlib){
  var _setImmediate = outlib.setImmediate,
    _clearImmediate = outlib.clearImmediate,
    _immediates = new Fifo(),
    to = null,
    _nexttickin = 0,
    _lasttickin = 0,
    _eobj = {
      now: null
    },
    _inimmediate = false;
    toc = 0;
  function setTo(){
    _lasttickin = _nexttickin;
    to = (_lasttickin || _inimmediate) ? setTimeout(do_immediates,_lasttickin) : _setImmediate(do_immediates);
  }
  function clearTo(){
    if(to){
      if(_lasttickin){
        clearTimeout(to);
      }else{
        _clearImmediate(to);
      }
      to = null;
    }
  }
  function go(){
    clearTo();
    setTo();
  }
  function immediater(i){
    if(i===null){
      console.log('NO IMMEDIATE!');
      throw 'No immediate';
      return;
    }
    var tdiff = i[1]-_eobj.now;
    //console.log('immediater got', i, tdiff, _nexttickin);
    if(tdiff<0){
      //console.log(i[2],'<',_eobj.now,'triggering');
      //i[0].apply(null,i[1]);
      i[0]();
      return;
    }else if(tdiff<_nexttickin){
      //console.log ('correcting _nexttickin from', _nexttickin, 'to', tdiff);
      _nexttickin=tdiff;
    }
    return true;
  }
  function do_immediates(){
    try {
    if(to){
      to = null;
    }
    _inimmediate = true;
    _nexttickin = Infinity;
    var start  = Date.now();
    _eobj.now = start;
    //console.log('drainConditionally starting', _immediates.length);
    _immediates.drainConditionally(immediater);
    //console.log('drainConditionally done', _immediates.length);
    if(_immediates.length){
      if (_nexttickin === Infinity) {
        _inimmediate = false;
        return;
      }
      if (to && _lasttickin === _nexttickin) {
        _inimmediate = false;
        return;
      }
      go();
    }
    _inimmediate = false;
    } catch(e) {
      console.error(e.stack);
      console.error(e);
    }
  }
  function set_immediate(i_p,delay){
    delay = delay||0;
    var tod = typeof delay;
    if(tod !== 'number'){
      console.trace();
      throw Error('delay not a number');
    }
    var ret = _immediates.push([i_p,Date.now()+delay]);
    //console.log('+1', _immediates.length);
    if((delay<_nexttickin) || (to===null && _immediates.length===1)){
      /*
      if (delay<_nexttickin) {
        console.log('first criterion', delay, _nexttickin, 'delay<_nexttickin', delay<_nexttickin);
      }
      if (to===null && _immediates.length===1) {
        console.log('second criterion', to, _immediates.length, to===null && _immediates.length===1);
      }
      */
      _nexttickin = delay;
      if (!_inimmediate) {
        go();
      }
    }
    return ret;
  }
  function runNext(cb,delay){
    if(!isFunction(cb)){return;}
    return set_immediate(cb,delay);
  }
  outlib.runNext = runNext;
  outlib.clearTimeout = function(item){
    _immediates.remove(item);
  };
  outlib.destroyASAP = function (destroyable) {
    runNext(destroyable.destroy.bind(destroyable));
  };
  outlib.intervals = {
    Second: 1000,
    Minute: 60*1000,
    Hour: 60*60*1000
  };
}

module.exports = augmentWithNext;

