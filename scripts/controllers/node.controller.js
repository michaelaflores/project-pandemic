'use strict';

pandemic.controller("NodeCtrl" ,function ($scope, UtilSrvc, nodeService) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var initialized = false;
  var w = canvas.width;
  var h = canvas.height;
  var nodeRadius = 7;
  var nodesArray = [];
  var speedX = 10;
  var speedY = 10;

  function createNode(nodeObject) {
    var randomx = Math.floor(Math.random()* canvas.width);
    var randomy = Math.floor(Math.random()* canvas.height);
    ctx.beginPath();
    ctx.arc(randomx, randomy, nodeRadius, 0, Math.PI*2);
    if (nodeObject.status == 1) {
      ctx.fillStyle = "#e55c50";
    } else {
      ctx.fillStyle = "#0095DD";
    }
    ctx.fill();
    ctx.closePath();
    nodeObject.x = randomx;
    nodeObject.y = randomy;
  }

  function changeDirection(node) {
    var dx = node.x;
    var dy = node.y;
    var randomx = Math.floor(Math.random() * 201) - 100;
    var randomy = Math.floor(Math.random() * 201) - 100;
    if (randomx > 0) {
      randomx = 1;
    } else {
      randomx = -1;
    }
    if (randomy > 0) {
      randomy = 1;
    } else {
      randomy = -1;
    }
    // bounds
    if (randomx + dx > canvas.width-nodeRadius || randomx + dx < nodeRadius) {
        dx = -dx;
    }
    if (randomy + dy > canvas.height-nodeRadius || randomy + dy < nodeRadius) {
        dy = -dy;
    }

    // Movement
    dx += randomx;
    dy += randomy;
    node.x = dx;
    node.y = dy;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI*2);
    if (node.status == 1) {
      ctx.fillStyle = "#e55c50";
    } else {
      ctx.fillStyle = "#0095DD";
    }
    ctx.fill();
    ctx.closePath();
  }

  function detectCollision(node1, node2) {
    var dx = node1.x - node2.x;
    var dy = node2.y - node2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < node1.radius + node2.radius) {
      console.log('collision between node ' + node1.id + ' and node ' + node2.id);
    }
  }

  function draw(nodesToCreate) {
    var nodesToCreate = nodesToCreate;
    var time = 1000 + 2000 * Math.random();
    if (nodesToCreate == null) {
      nodesToCreate = 50;
    }

    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);

    // Node creation
    if (!initialized) {
      nodesArray = nodeService.createNodes(nodesToCreate, 10);
      angular.forEach(nodesArray, function(value, key) {
        createNode(value);
      });
      initialized = true;
    }

    angular.forEach(nodesArray, function(value, key) {
      changeDirection(value);
    });
  }

  setInterval(draw, 32);
});
