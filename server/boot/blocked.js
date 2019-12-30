'use strict';

/*
const blockedAt = require('blocked-at');

module.exports = function(app) {
  blockedAt(
    (ms, stack) => {
      console.log('Event loop blocked for', ms, 'milliseconds', stack);
    },
    {
      debug:true
    }
  );
};

*/

module.exports = function(app) {


  const asyncHooks = require('async_hooks');

  const cache = {};

  const asyncHook = asyncHooks.createHook({ init, before, after, destroy });

  const debugLog = (title, message) => process._rawDebug('\t\t',title, message);

  function init (asyncId, type, triggerAsyncId, resource) {
    const e = {}
    Error.captureStackTrace(e)
    //debugLog('init', asyncId+' '+type+' '+triggerAsyncId)
    const cached = { asyncId, type, triggerAsyncId, stack: e.stack}
    cache[asyncId] = cached;
  }

  function before (asyncId) {
    //debugLog('before', asyncId+' ')
    const cached = cache[asyncId];
    if (!cached) { return }
    cached.t0 = hrtime()
  }
  function after (asyncId) {
    let cached = cache[asyncId];
    if (!cached) { return }
    const t1 = hrtime()
    const dt = ((t1 - cached.t0) / 1000).toFixed(1);
    debugLog(''+cached.type,cached.asyncId+' triggered by '+cached.triggerAsyncId+' '+dt+'ms')
    if (dt > 50) {
      debugLog(''+cached.type,cached.asyncId+' trace:');
      let lines = cached.stack.split('\n');
      lines.splice(0,3); // Remove the Error line and the two about this script
      debugLog(lines.join('\n\t\t'));
      cached = cache[cached.triggerAsyncId];
      if (cached) {
        debugLog(''+cached.type,cached.asyncId+' trace:');
        lines = cached.stack.split('\n');
        lines.splice(0,3); // Remove the Error line and the two about this script
        debugLog(lines.join('\n\t\t'));
      }
    }
  }

  function destroy (asyncId) {
    const cached = cache[asyncId];
    if (!cached) { return }
    //delete cache[asyncId];
  }

  asyncHook.enable()
  return {
    stop: () => {
      asyncHook.disable()
    }
  }

};

function hrtime () {
  const t = process.hrtime()
  return t[0] * 1000000 + t[1] / 1000
}
