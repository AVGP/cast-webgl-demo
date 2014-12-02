var World  = require('./world.js'),
        Player = require('./player.js');

function makeSkybox(world) {
  var imagePrefix = "images/dawnmountain-";
  var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
  var imageSuffix = ".png";
  var skyGeometry = new THREE.BoxGeometry( 2000, 2000, 2000 );

  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
      side: THREE.BackSide
    }));
  var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
  world.add( skyBox );
}

World.init({renderCallback: function() {
  if(window.update) window.update();
  pivot.translateZ(-1);
}});

var g = new THREE.BoxGeometry(10, 10, 10),
    m = new THREE.MeshBasicMaterial({color: 0x00ff00}),
    c = new THREE.Mesh(g, m);

window.world = World;

var pivot = new THREE.Object3D();
pivot.add(World.getCamera());

Player.init().then(function() {
  var playerMesh = Player.getMesh();
  pivot.add(playerMesh);
});

World.add(pivot);

makeSkybox(World);

World.startRenderLoop();

// Controls
//
