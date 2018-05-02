class TestScene extends Phaser.Scene {

  constructor(){
      super({
        key:"TestScene"
      })
      // this.game=new Phaser.Game({
      //   type: Phaser.AUTO,
      //   parent: 'content',
      //   width: 640,
      //   height: 480,
      //   resolution: 1, 
      //   backgroundColor: "#EDEEC9",
      //   scene: [
      //     TestScene
      //   ]
      // })
  }
  progressBar: any;

  onLoadComplete() { // (loader, storageSize, failedSize)
    console.log('onLoadComplete');
    this.progressBar.destroy();
  }

  onLoadProgress(progress) {
    this.progressBar
      .clear()
      .fillStyle(0xffffff, 0.75)
      .fillRect(0, 0, 800 * progress, 50);
    console.log('progress', progress);
  }
  preload(){
    this.load.image('sky', 'space3.png');
    this.load.image('logo', 'phaser3-logo.png');
    this.load.image('red', 'red.png');
    this.load.image('obstacle', 'obstacle.png')
    this.progressBar=this.add.graphics({})
    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
  }
  
  obstacle:any;
  moveObstacle(obstacleObject){
  }
  create(){
    let obstacle=this.physics.add.image(400, 100, 'obstacle')
    // let logo1 = (this.physics.add.image(400, 100, 'obstacle'))
    // logo1.setFriction(0)
    // logo1.setVelocity(100, 100);
    // logo1.setDrag(0);
    // logo1.setBounce(1)
    // logo1.setCollideWorldBounds(1)
    

  }
}
export default TestScene;
  // init: function (data) {
  //   console.log('init', data, this);
  // },

  // preload: function () {
  //   this.load.image('sky', 'space3.png');
  //   this.load.image('logo', 'phaser3-logo.png');
  //   this.load.image('red', 'red.png');
  //   this.progressBar = this.add.graphics(0, 0);
  //   this.load.on('progress', this.onLoadProgress, this);
  //   this.load.on('complete', this.onLoadComplete, this);
  // },
  // createObstacles: function(){

  // },

  // create: function () {
  //   var sky = this.add.image(400, 300, 'sky');
  //   sky.alpha = 0.5;
  //   // var particles = this.add.particles('red');
  //   // var emitter = particles.createEmitter({
  //   //   speed: 500,
  //   //   scale: { start: 1, end: 0 },
  //   //   blendMode: 'ADD'
  //   // });
  //   var logo1 = this.physics.add.image(400, 100, 'logo')
  //   .setFriction(0)
  //   .setMass(0)
  //   .setVelocity(50, 50)
  //   .setBounce(1, 1)
  //   .setCollideWorldBounds(true);

  //   var logo2 = this.physics.add.image(400, 100, 'logo')
  //   .setFriction(0)
  //   .setMass(0)
  //   .setVelocity(100, 100)
  //   .setBounce(1, 1)
  //   .setCollideWorldBounds(true);

  //   let cat1=this.physics.world.nextCategory();
  //   logo1.setCollisionCatagory(cat1);
  //   logo2.setCollisionCatagory(cat1);

    
  // },

  // extend: {

  //   progressBar: null,

  //   onLoadComplete: function () { // (loader, storageSize, failedSize)
  //     console.log('onLoadComplete');
  //     this.progressBar.destroy();
  //   },

  //   onLoadProgress: function (progress) {
  //     this.progressBar
  //       .clear()
  //       .fillStyle(0xffffff, 0.75)
  //       .fillRect(0, 0, 800 * progress, 50);
  //     console.log('progress', progress);
  //   }

  // }

