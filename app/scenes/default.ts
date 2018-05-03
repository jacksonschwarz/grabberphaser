
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
    this.load.image('obstacle', 'obstacle.png')
    this.load.image("token", "token.png")
    this.load.image("player", "player.png")
    this.load.audio("getToken", "sounds/pling.ogg", null, null);
    this.load.audio("death", "sounds/death2.ogg", null, null);
    this.load.image("resetButton", "resetbutton.png");
    this.progressBar=this.add.graphics({})
    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
  }

  //Declare Variables:
  //Representing the player sprite. Is initialized in the create() function
  player:any;
  //Current score, default value is 0.
  score:number=0;
  //Represents the text that displays the score
  scoreText;
  //Represents the sprite of the reset button
  resetButton;

  //How many obstacles are on the board?
  numberOfObstacles:number=5;
  //How big are they? (Default size, 25 px)
  obstacleScale:number=1.5;
  //How fast are they going?
  velocity:number=100;
  //An array of the sprites for updating and deleting obstacles
  obstacleGroup=[];


  //How many tokens are on the board?
  numberOfTokens:number=5;
  //How large are the tokens? (Default size, 25px)
  tokenScale:number=1.5;
  //An array of sprites for updating and deleting tokens
  tokenGroup=[];

  //if the game has not started, this is false
  gameStarted:boolean;
  //is the "Press SPACEBAR to begin" text
  startIntstructionText;

  //declare variable for spacebar
  keySpace;
  /**
   * Creates the token objects, adds colliders between the player and the tokens. 
   */
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
  /**
   * Creates obstacles, setting their random locations and physics properties.
   */
  createObstacle=(player, velocity)=>{
    for(let i=0;i<this.obstacleGroup.length;i++){
      this.obstacleGroup[i].disableBody(true, true);
    }
    let obstacleGroup=this.physics.add.group()
    for(let i=0;i<this.numberOfObstacles;i++){
      let obstacle=this.physics.add.sprite(Phaser.Math.Between(50, 500), Phaser.Math.Between(50,500), "obstacle")
      let directionNumber=Phaser.Math.Between(1, 4);
      obstacle.body["allowGravity"]=false
      obstacle.setBounce(1);
      obstacle.setCollideWorldBounds(1);
      obstacle.setScale(this.obstacleScale)
      this.obstacleGroup.push(obstacle);
    }
  }
  /**
   * Goes through the "obstacleGroup" array and for each one, updates the velocity and scale to the specified parameters
   */
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
  /**
   * Goes through the "tokenGroup" array and sets each token's scale to the specified 
   */
  updateTokens=(tokenScale)=>{
    for(let i=0;i<this.tokenGroup.length;i++){
      let token=this.tokenGroup[i];
      token.setScale(tokenScale)
    }
  }
  /**
   * When a player collides with a token object, the token goes away, a sound is played, the score is updated and next level checked
   */
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
  /**
   * Callback for getting hit by an obstacle, plays the death sound, creates the reset button, deletes all existing gameobjects on the board.
   */
  hitByObstacle=(obstacle, player)=>{
    // player.disableBody(true, true);
    let deathSound=this.sound.add("death")
    deathSound.play()
    console.log("HIT!")
    let gameOverText= this.add.text(
      0, 
      0, 
      "GAME OVER!", 
      { 
        fontFamily: 'Arial', 
        fontSize: 45, color: 'white' 
      })
    // this.createButton(player)
    for(let i=0;i<this.obstacleGroup.length;i++){
      this.obstacleGroup[i].disableBody(true, true);
    }

    for(let i=0;i<this.tokenGroup.length;i++){
      this.tokenGroup[i].disableBody(true, true);
    }

    this.score=0;

    this.numberOfObstacles=5;
    this.obstacleScale=1.5;
    this.velocity=100;
    this.obstacleGroup=[];
  
    this.numberOfTokens=5;
    this.tokenScale=1.5;
    
    //create button
    let container=this.add.container(90, 550);
    container.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);
    let resetButton=this.add.sprite(0, 0, "resetButton")
    container.add(resetButton);
    container.on("pointerover", function(){
      resetButton.setTint(0x3366CC);
    })
    container.on("pointerout", function(){
      resetButton.clearTint();
    })
    container.on("pointerup", ()=>{
      this.resetGame(player)
      gameOverText.setText("")
      resetButton.destroy()
    })
  }
  /**
   * Resets the game states for all of the game objects. It creates new obstacles
   */
  resetGame=(player)=>{
    for(let i=0;i<this.obstacleGroup.length;i++){
      this.obstacleGroup[i].disableBody(true, true);
    }

    for(let i=0;i<this.tokenGroup.length;i++){
      this.tokenGroup[i].disableBody(true, true);
    }
    this.score=0;

    this.numberOfObstacles=5;
    this.obstacleScale=1.5;
    this.velocity=100;
    this.obstacleGroup=[];
  
    this.numberOfTokens=5;
    this.tokenScale=1.5;
    this.gameStarted=false;
    
    // this.createTokens(player)
    this.createObstacle(player, this.velocity);

    this.startIntstructionText.setText("Press SPACEBAR to start the game")
    
  }
  /**
   * Updates the tokens and obstacles 
   */
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
  /**
   * Phaser create functio 
   */
  create(){
    let player=this.physics.add.sprite(400, 250, "player");
    player.setBounce(-1);
    player.body["allowGravity"]=false
    this.player=player;
    
    this.startIntstructionText=this.add.text(
      0,
      0,
      "Press SPACEBAR to start the game",
      {
        fontFamily: "Arial",
        fontSize:30,
        color:"white"
      }
    )
  
    // this.createTokens(player)
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
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  /**
   * Phaser update function
   */
  update(){
    if(this.keySpace.isDown){
     if(!this.gameStarted){
        this.gameStarted=!this.gameStarted
        this.updateObstacles(this.velocity, this.obstacleScale);
        for(let i=0;i<this.obstacleGroup.length;i++){
          this.physics.add.collider(this.obstacleGroup[i], this.player, this.hitByObstacle, null, null);
        }
        this.createTokens(this.player);
        this.startIntstructionText.setText("");
      }
    }
  }

}
export default TestScene;