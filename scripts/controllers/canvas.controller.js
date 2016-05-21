'use strict';

pandemic.controller("NodeController", function($scope, UtilSrvc) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  console.log('about to check rAF');
  console.log('rendering');
  window.requestAnimationFrame = ( function() {
      return window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
              window.setTimeout( callback, 1000 / 60 );
          };
  } )();
});
