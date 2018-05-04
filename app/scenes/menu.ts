export class Menu extends Phaser.Scene{
    constructor(){
        super({
            key:"menu"
        })
    }
    preload=()=>{
        this.load.image("resetButton", "resetbutton.png");
        this.load.image("gameover", "game_over.png");
    }
    create=()=>{
        let bg=this.cameras.add(0, 0, 800, 800);
        bg.setBackgroundColor("black")
    }
}