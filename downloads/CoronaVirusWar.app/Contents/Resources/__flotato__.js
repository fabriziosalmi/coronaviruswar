
"use strict";

if (!window.__flotato__) {
    Object.defineProperty(window, "__flotato__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
            userScripts: {},
            includeOnce: function(userScript, initializer) {
                if (!__flotato__.userScripts[userScript]) {
                    __flotato__.userScripts[userScript] = true;
                       if (typeof initializer === 'function') {
                          initializer();
                    }
                    return false;
                }
                          
            return true;
        }
    }
  });
}
