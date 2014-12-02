var World  = require('./world.js'),
    Player = require('./player.js'),
    pivot;

function initGame() {
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

  pivot = new THREE.Object3D();
  pivot.add(World.getCamera());

  Player.init().then(function() {
    var playerMesh = Player.getMesh();
    pivot.add(playerMesh);
    document.body.removeChild(document.querySelector('h1'));
    World.startRenderLoop();
  });

  World.add(pivot);

  makeSkybox(World);
}

function initReceiver() {
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  var appConfig = new cast.receiver.CastReceiverManager.Config();

  appConfig.statusText = 'Ready to play';
  appConfig.maxInactivity = 6000;

  window.messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:de.geekonaut.webgldemo');
  window.castReceiverManager.start(appConfig);

  window.castReceiverManager.onReady = function(event) {
    console.log('Received Ready event: ' + JSON.stringify(event.data));
    window.castReceiverManager.setApplicationState("Application status is ready...");
  };

  window.castReceiverManager.onSenderConnected = function(event) {
    console.log('Received Sender Connected event: ' + event.data);
    console.log(window.castReceiverManager.getSender(event.data).userAgent);
  };

  window.messageBus.onMessage = function(msg) {
    switch(msg.data) {
      case'up':
        pivot.rotation.x -= 0.05;
        break;
      case 'down':
        pivot.rotation.x += 0.05;
        break;
      case 'left':
        pivot.rotation.y += 0.05;
        break;
      case 'right':
        pivot.rotation.y -= 0.05;
        break;
    }
  }
}

window.onload = function() {
  initReceiver();
  initGame();
};
