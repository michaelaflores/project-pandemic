'use strict';

pandemic.controller("NodeCtrl" ,function ($scope, UtilSrvc) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var dx = Math.floor((Math.random() * Math.random()) - Math.random());
  var dy = Math.floor((Math.random() * Math.random()) - Math.random());
  var w = canvas.width;
  var h = canvas.height;
  var nodeRadius = 7;
  var speedX = 10;
  var speedY = 10;

  function createNode() {
    var randomx = Math.floor(Math.random()* canvas.width);
    var randomy = Math.floor(Math.random()* canvas.height);  
    ctx.beginPath();
    ctx.arc(randomx, randomy, nodeRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  // test
  function changeDirection() {
    var me = this;
    var speedX = Math.random() < 0.5 ? 1 : -1;
    var speedY = Math.random() < 0.5 ? 1 : -1;
    this.speedX = speedX * (1 + Math.random() * 2);
    this.speedY = speedY * (1 + Math.random() * 2);
    var time = 1000 + 2000*Math.random();
    setTimeout(function() {me.changeDirection()}, time);
  }

  function draw() {

      // Background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, w, h);

      // Node creation
      for (var x = 1; x <= 50; x++) {
        createNode();
      }

      // bounds
      if(randomx + dx > canvas.width-nodeRadius || randomx + dx < nodeRadius) {
          dx = -dx;
      }
      if(randomy + dy > canvas.height-nodeRadius || randomy + dy < nodeRadius) {
          dy = -dy;
      }

      // Movement
      randomx += dx;
      randomy += dy;

      // Change Direction

  }

  setInterval(draw, 5);
});
