p'use strict';

pandemic.controller("NodeCtrl" ,function($scope, UtilSrvc, nodeService) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var initialized = false;
  var w = canvas.width;
  var h = canvas.height;
  var collArray = [];
  var gridArray = [];
  var nodeRadius = 7;
  var nodesArray = [];
  var speedX = 10;
  var speedY = 10;

  // utility extensions
  Number.prototype.between = function (min, max) {
    return this > min && this < max;
  };

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

  function infectNode(uninfectedNode, infectedNode) {
    // Should add baseStrength once we can initialize a random base on node creation for super nodes
    var randomDiseaseResistance = Math.floor(Math.random() * 10) - 9;
    var randomDiseaseStrength = Math.floor(Math.random() * 10) - 9;

    if (uninfectedNode.factor == undefined) {
      var uninfectedNode.factor = randomDiseaseResistance;
    }

    if (infectedNode.factor == undefined) {
      var infectedNode.factor = randomDiseaseStrength;
    }

    if (infectedNode.factor > uninfectedNode.factor) {
      uninfectedNode.status = 1;
    }

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

  function detectBox(node) {
    angular.forEach(gridArray, function(value, key) {
      if (node.x.between(value.xStart, value.xEnd) && node.y.between(value.yStart, value.yEnd)) {
        node.inBox = value.boxId;
      }
    });
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
      createSpatial();
      initialized = true;
    }

    angular.forEach(nodesArray, function(value, key) {
      detectBox(value);
      changeDirection(value);
    });

    angular.forEach(gridArray, function(gridVal, gridKey) {
      collArray[gridKey] = {
        id: gridVal.boxId,
        nodes: []
      };
      angular.forEach(nodesArray, function(nodeVal, nodeKey) {
        if (gridVal.boxId == nodeVal.inBox) {
          collArray[gridKey].nodes.push(nodeVal);
        }
      });
    });

  }

  function createSpatial() {
    var width = 850;
    var height = 500;
    var gridSize = 10;
    var yCellSize = height / gridSize;
    var xCellSize = width / gridSize;
    var idCounter = 0;
    gridArray = [];

    var addGridCell = function(boxId, yStart, yEnd, xStart, xEnd) {
      var gridCell = {};
      gridCell.boxId = idCounter;
      gridCell.yStart = yStart;
      gridCell.yEnd = yEnd;
      gridCell.xStart = xStart;
      gridCell.xEnd = xEnd;
      gridArray.push(gridCell);
    }

    for (var yPixel = 0; yPixel < height; yPixel += yCellSize) {
      for (var xPixel = 0; xPixel < width; xPixel += xCellSize) {
        var nextY = yPixel + yCellSize;
        var nextX = xPixel + xCellSize;
        addGridCell(idCounter, yPixel, nextY, xPixel, nextX);
        idCounter++;
      }
    }
  }

  setInterval(draw, 1000);
});
