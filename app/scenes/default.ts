
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
    this.load.audio("getToken", "sounds/pling.ogg", null, null);
    this.load.audio("death", "sounds/death2.ogg", null, null);
    this.progressBar=this.add.graphics({})
    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
  }

  //Declare Variables:
  player:any;
  score:number=0;
  scoreText;

  numberOfObstacles:number=5;
  obstacleScale:number=1.5;
  velocity:number=100;
  obstacleGroup=[];

  numberOfTokens:number=5;
  tokenScale:number=1.5;
  tokenGroup=[];

  createTokens=(player)=>{
    let tokenGroup=this.physics.add.group()
    for(let i=0;i<this.numberOfTokens;i++){
      let token=tokenGroup.create(Phaser.Math.Between(50, 500), Phaser.Math.Between(50, 500), "token")
      //another bullshit error
      token.setScale(this.tokenScale);
      token.body["allowGravity"]=false;
      this.tokenGroup.push(token);
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
      obstacle.setScale(this.obstacleScale)
      //this line produces a dumb error. Ignore it, it works anyway
      this.physics.add.collider(obstacle, player, this.hitByObstacle, null, null);
      this.obstacleGroup.push(obstacle);
    }

  }
  updateObstacles=(velocity, obstacleScale)=>{
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
      obstacle.setScale(obstacleScale)
    }
  }
  updateTokens=(tokenScale)=>{
    for(let i=0;i<this.tokenGroup.length;i++){
      let token=this.tokenGroup[i];
      token.setScale(tokenScale)
    }
  }
  collectToken=(token, player)=>{
    token.disableBody(true, true)
    let tokenSound=this.sound.add("getToken");    
    tokenSound.play();
    this.score++;
    this.scoreText.setText("Score : "+this.score)
    if(this.score % this.numberOfTokens == 0){
      this.nextLevel(player, 0.1, 25, 0.1)
    }
    console.log("collected!");
  }
  //callback for getting hit by an obstacle 
  hitByObstacle=(obstacle, player)=>{
    player.disableBody(true, true);
    let deathSound=this.sound.add("death")
    deathSound.play()
    console.log("HIT!")
    this.scoreText = this.add.text(
      0, 
      0, 
      "GAME OVER!", 
      { 
        fontFamily: 'Arial', 
        fontSize: 45, color: 'white' 
      })
  }
  resetGame=()=>{

    this.score=0;

    this.numberOfObstacles=5;
    this.obstacleScale=1.5;
    this.velocity=100;
    this.obstacleGroup=[];
  
    this.numberOfTokens=5;
    this.tokenScale=1.5;
  }
  nextLevel=(player, obstacleScaleDelta, obstacleVelocityDelta, tokenScaleDelta)=>{
    if(this.velocity < 250){
      this.velocity+=obstacleVelocityDelta 
    }
    if(this.obstacleScale < 3){
      this.obstacleScale+=obstacleScaleDelta; 
    }
    if(this.tokenScale > 0.5){
      this.tokenScale-=tokenScaleDelta;      
    }
    this.createTokens(player)
    this.updateObstacles(this.velocity, this.obstacleScale)
    this.updateTokens(this.tokenScale)
  }

  create(){
    let player=this.physics.add.sprite(400, 250, "player");
    player.body["allowGravity"]=false
    
    this.createTokens(player)
    this.createObstacle(player, this.velocity)

    this.scoreText = this.add.text(
      500, 
      0, 
      'Score: '+this.score, 
      { 
        fontFamily: 'Arial', 
        fontSize: 45, color: 'white' 
      })

    this.input.on("pointermove", function(pointer){
      player.setX(pointer.x);
      player.setY(pointer.y);
    })
  }
}
export default TestScene;