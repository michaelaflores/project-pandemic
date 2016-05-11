'use strict';

pandemic.controller("CanvasCtrl" ,function ($scope, UtilSrvc) {
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
}
