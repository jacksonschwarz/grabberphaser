
class TestScene extends Phaser.Scene {

  constructor(){
      super({
        key:"TestScene"
      })
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
    this.load.image("token", "token.png")
    this.load.image("player", "player.png")
    this.progressBar=this.add.graphics({})
    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
  }

  //Declare Variables:
  player:any;
  score:number=0;
  scoreText;

  numberOfObstacles:number=5;
  obstacleScale:number=1;
  velocity:number=100;
  obstacleGroup=[];

  numberOfTokens:number=5;
  tokenScale:number=1;
  tokenGroup=[];

  createTokens=(player)=>{
    let tokenGroup=this.physics.add.group()
    for(let i=0;i<this.numberOfTokens;i++){
      let token=tokenGroup.create(Phaser.Math.Between(50, 500), Phaser.Math.Between(50, 500), "token")
      token.body["allowGravity"]=false;
      //this line produces a dumb error. Ignore it, it works anyway.
      this.physics.add.collider(token, player, this.collectToken, null, null);
    }
  }
  createObstacle=(player, velocity)=>{
    for(let i=0;i<this.obstacleGroup.length;i++){
      this.obstacleGroup[i].disableBody(true, true);
    }
    let obstacleGroup=this.physics.add.group()
    for(let i=0;i<this.numberOfObstacles;i++){
      let obstacle=this.physics.add.sprite(Phaser.Math.Between(50, 500), Phaser.Math.Between(50,500), "obstacle")
      let directionNumber=Phaser.Math.Between(1, 4);
      if(directionNumber == 1){
        obstacle.setVelocity(velocity, velocity);            
      }
      else if(directionNumber==2){
        obstacle.setVelocity(-velocity, -velocity)
      }
      else if(directionNumber==3){
        obstacle.setVelocity(-velocity, velocity)
      }
      else if(directionNumber==4){
        obstacle.setVelocity(velocity, -velocity)
      }
      obstacle.body["allowGravity"]=false
      obstacle.setBounce(1);
      obstacle.setCollideWorldBounds(1);
      //this line produces a dumb error. Ignore it, it works anyway
      this.physics.add.collider(obstacle, player, this.hitByObstacle, null, null);
      this.obstacleGroup.push(obstacle);
    }

  }
  updateObstacles=(velocity)=>{
    for(let i=0;i<this.obstacleGroup.length;i++){
      let obstacle=this.obstacleGroup[i]
      let directionNumber=Phaser.Math.Between(1, 4);
      if(directionNumber == 1){
        obstacle.setVelocity(velocity, velocity);            
      }
      else if(directionNumber==2){
        obstacle.setVelocity(-velocity, -velocity)
      }
      else if(directionNumber==3){
        obstacle.setVelocity(-velocity, velocity)
      }
      else if(directionNumber==4){
        obstacle.setVelocity(velocity, -velocity)
      }
    }
  }
  collectToken=(token, player)=>{
    token.disableBody(true, true)
    this.score++;
    this.scoreText.setText("Score : "+this.score)
    if(this.score % this.numberOfTokens == 0){
      this.nextLevel(player, 0, 50, 0)
    }
    console.log("collected!");
  }
  //callback for getting hit by an obstacle 
  hitByObstacle=(obstacle, player)=>{
    player.disableBody(true, true);
    console.log("HIT!")
  }
  nextLevel=(player, obstacleScaleDelta, obstacleVelocityDelta, tokenScaleDelta)=>{
    this.velocity+=obstacleVelocityDelta
    this.createTokens(player)
    this.updateObstacles(this.velocity)
  }

  create(){
    let player=this.physics.add.sprite(400, 250, "player");
    player.body["allowGravity"]=false
    
    this.createTokens(player)
    this.createObstacle(player, this.velocity)
    this.scoreText = this.add.text(
      400, 
      300, 
      'Score: '+this.score, 
      { 
        fontFamily: 'Arial', 
        fontSize: 64, color: 'white' 
      })

    this.input.on("pointermove", function(pointer){
      player.setX(pointer.x);
      player.setY(pointer.y);
    })
  }
}
export default TestScene;