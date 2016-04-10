"use strict";

pandemic.filter('interpolate', function (version) {
    return function(text) {
       return String(text).replace(/\%VERSION\%/mg, version);
     }
});
