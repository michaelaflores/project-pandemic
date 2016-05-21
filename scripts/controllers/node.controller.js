'use strict';

pandemic.controller("NodeCtrl" ,function ($scope, UtilSrvc, nodeService) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var dx = Math.floor((Math.random() * Math.random()) - Math.random());
  var dy = Math.floor((Math.random() * Math.random()) - Math.random());
  var w = canvas.width;
  var h = canvas.height;
  var nodeRadius = 7;
  var speedX = 10;
  var speedY = 10;

  function createNode(nodeObject) {
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
    var speedX = 1;
    var speedY = 1;

    var time = 1000 + 2000*Math.random();
    setTimeout(function() {me.changeDirection()}, time);
  }

  function draw(nodesToCreate) {
    var randomx = 1;
    var randomy = 1;
    var nodesToCreate = nodesToCreate;
    if (nodesToCreate == null)
      nodesToCreate = 1;
      // Background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, w, h);

      // Node creation
      var nodesArray = nodeService.createNodes(nodesToCreate);
      angular.forEach(nodesArray, function(value, key) {
        createNode(value);
      });

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

  setInterval(draw, 1000);
});
