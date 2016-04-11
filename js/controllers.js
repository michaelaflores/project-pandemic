'use strict';

pandemic.controller("MyCtrl1" ,function ($scope, UtilSrvc) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  if ( !window.requestAnimationFrame ) {
      window.requestAnimationFrame = ( function() {
          return window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                  window.setTimeout( callback, 1000 / 60 );
              };
      } )();
  }

  var w = canvas.width;
  var h = canvas.height;

  var circle = function(color, r) {
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
      ctx.closePath();

      ctx.fill();
  }

  var frameOffset = 5;
  var curX = w / 2;
  var curY = h / 2;
  var xFac = 3;
  var yFac = 3;

  var i = 0;
  var redraw = function() {
      if(!(i % frameOffset)) {
          ctx.save();

          // Backgrou d
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, w, h);

          // Origin to next location
          curX += Math.random() * xFac * 2 - xFac;
          curY += Math.random() * yFac * 2 - yFac;

          // Limit bounds
          curX = clamp(curX, 0, w);
          curY = clamp(curY, 0, h);

          ctx.translate(curX, curY);

          // Node
          circle('green', 2);

          ctx.restore();
      }

      i++;

      window.requestAnimationFrame(redraw);
  };

  window.requestAnimationFrame(redraw);

  function clamp(v, min, max) {
      return Math.min(Math.max(v, min), max);
  }
});

pandemic.controller("MyCtrl2" ,function ($scope) {

});
