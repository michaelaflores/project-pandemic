'use strict';
pandemic.controller("NodeCtrl" ,function($scope, UtilSrvc, nodeService) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var initialized = false;
  var w = canvas.width;
  var h = canvas.height;
  var collArray = [];
  var gridArray = [];
  var nodeRadius = 1.6;
  var nodesArray = [];
  var coll, gridfinished = false;
  var speed = 1.5;
  var hashIsDrawn = false;
  var infectedCount = 0;
  var timerVar = setInterval(countTimer, 1000);
  var totalSeconds = 0;
  $scope.startingInfectedCount = 10;
  $scope.startingNodes = 5000;
  $scope.changeSpeed = speed;

  // utility extensions
  Number.prototype.between = function (min, max) {
    return this > min && this < max;
  };

  function createNode(nodeObject) {
    var randomx = Math.floor(Math.random()* canvas.width);
    var randomy = Math.floor(Math.random()* canvas.height);
    ctx.beginPath();
    ctx.arc(randomx, randomy, nodeRadius, 0, Math.PI*2);
    if (nodeObject.status === 1) {
      ctx.fillStyle = "#F44336";
    } else {
      ctx.fillStyle = "#455A64";
    }
    ctx.fill();
    ctx.closePath();
    nodeObject.x = randomx;
    nodeObject.y = randomy;
  }

  function infectNode(infectedNode, uninfectedNode) {
    // Should add baseStrength once we can initialize a random base on node creation for super nodes
    var randomDiseaseResistance = Math.floor(Math.random() * 10) - 9;
    var randomDiseaseStrength = Math.floor(Math.random() * 10) - 9;

    if (infectedNode.factor > uninfectedNode.factor) {
      $scope.infectedCount += infectedCount++;
      uninfectedNode.status = 1;
      infectedNode.status = 1;
      infectedNode.fillStyle = "#e55c50";
      uninfectedNode.fillStyle = "#e55c50";
      console.log("Node has been infected! :)");
    }
  }

  function changeDirection(node) {
    var dx = node.x;
    var dy = node.y;
    var randomx = Math.floor(Math.random() * 201) - 100;
    var randomy = Math.floor(Math.random() * 201) - 100;
    if (randomx > 0) {
      randomx = speed;
    } else {
      randomx = -speed;
    }
    if (randomy > 0) {
      randomy = speed;
    } else {
      randomy = -speed;
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
      ctx.fillStyle = "#ff1b56";
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
    if (node1.status === 1 && node2.status === 1) {
      return;
    } // Only checking collision if one node is infected
    else if (node1.status === 1 || node2.status === 1) {
      var dx = node1.x - node2.x;
      var dy = node1.y - node2.y;
      var distance = Math.hypot((node2.x - node1.x, node2.y - node1.y)/2);
      if (distance < nodeRadius * 2) {
        // console.log('collision between node ' + node1.id + ": " + node1.status + ' and node ' + node2.id + ": " + node2.status);
        infectNode(node1, node2);
      }
    }
  }

  function draw(nodesToCreate) {
    var nodesToCreate = $scope.startingNodes;
    var time = 1000 + 2000 * Math.random();
    if (nodesToCreate == null) {
      // Amount of normal nodes
      nodesToCreate = 5000;
    }

    // Node creation
    if (!initialized) {
      // Amount of infected nodes
      nodesArray = nodeService.createNodes(nodesToCreate, $scope.startingInfectedCount);
      infectedCount += $scope.startingInfectedCount;
      angular.forEach(nodesArray, function(value, key) {
        createNode(value);
      });
      createSpatial();
      initialized = true;
    }

    document.getElementById("infectedCount").innerHTML = infectedCount;

    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);

    angular.forEach(nodesArray, function(value, key) {
      detectBox(value);
      changeDirection(value);
    });

    angular.forEach(gridArray, function(gridVal, gridKey) {
      hashIsDrawn = true;
      collArray[gridKey] = {
        id: gridVal.boxId,
        nodes: []
      };

      // Look through this. PS 170,000+ logs after a few seconds.
      angular.forEach(nodesArray, function(nodeVal, nodeKey) {
        if (gridVal.boxId == nodeVal.inBox) {
          if (!coll) {
          }
          collArray[gridKey].nodes.push(nodeVal);
        }
      });
    });
    coll = true;

    angular.forEach(collArray, function(colVal, colKey) {
      angular.forEach(colVal.nodes, function(nodeVal, nodeKey) {
        if (colVal.nodes.length < 2) {
          return;
        }
        for (var i = 0; i < collArray[colKey].nodes.length - 1; i++) {
          detectCollision(collArray[colKey].nodes[i], collArray[colKey].nodes[i+1]);
        }
      });
    });
  }

  function countTimer() {
    $scope.seconds = ++totalSeconds;
    var hour = Math.floor(totalSeconds /3600);
    var minute = Math.floor((totalSeconds - hour*3600)/60);
    var seconds = totalSeconds - (hour*3600);
    document.getElementById("secondsCounter").innerHTML = seconds;
  }

  function createSpatial() {
    // console.log("spatial created")
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
    if (!gridfinished) {
      // console.log(gridArray);
    }
    gridfinished = true;
  }

  $scope.increaseSpeed = function() {
    if (speed + .5 < 4) {
      $scope.changeSpeed = speed + .5;
      return speed += .5;
    }
  }

  $scope.reduceSpeed = function() {
    if (speed - .5 >= .5) {
      $scope.changeSpeed = speed - .5;
      return speed -= .5;
    }
  }

  setInterval(draw, 30);
});
