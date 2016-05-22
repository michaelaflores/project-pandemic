pandemic.factory('nodeService', nodeService);

function nodeService($log) {
  return {
    createNodes: createNodes,
    deleteNode: deleteNode,
    updateNode: updateNode
  }

  function createNodes(numberToCreate, initialInfectedCount, averageInfectionFactor,
    averageResistanceFactor, averageInfectedSpeed, averageNormalSpeed) {
    var nodesArray = [];
    var infectedCreated = 0;
    for (var num = 0; num <= numberToCreate; num++) {
      var status;
      if (infectedCreated < initialInfectedCount) {
        console.log('added zombie');
        status = 1;
        infectedCreated++;
      } else {
        status = 0;
      }
      var randomSpeed = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      var randomFactor = 8;
      nodesArray.push(new Node(status, randomSpeed, randomFactor));
    }
    return nodesArray;
  }

    // placeholder
    function deleteNode() {
      console.log('deleteNode()');
    }

    // placeholder
    function updateNode() {
      console.log('updateNode()');
    }

    // constructor function for Node objects
    function Node(status, speed, factor) {
      this.status = status;
      this.speed = speed;
      this.factor = factor;
      this.x;
      this.y;
      return this;
    }
  }
