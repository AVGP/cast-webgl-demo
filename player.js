var Q = require('q'),
    Player = (function() {

  // Internals

  var loader = new THREE.OBJLoader(), mesh, self = {};

  // External interface

  self.init = function() {
    var d = Q.defer();

    loader.load('toyplane.obj', function (object) {
      mesh = object;
      mesh.scale.set(2,2,2);
//      mesh.rotation.set(0, Math.PI/2, 0);

      var material = new THREE.MeshPhongMaterial({diffuseColor: 0x00ff00});

      mesh.traverse(function(child) {
        if(child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      /**/
      console.log("Loaded!");
      window.mesh = mesh;
      d.resolve(self);
    }, undefined, function(error) {
      console.error("Error loading player:", error);
      alert("Error loading player: " + error);
      d.reject(error);
    });

    return d.promise;
  }

  self.getMesh = function() { return mesh; };

  return self;
})();

module.exports = Player;
