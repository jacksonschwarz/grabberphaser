import {TestScene} from "./default";
import {Menu} from "./menu";
import {Button} from './utils';
class Main extends Phaser.Scene{
    constructor(){
        super({
            key:"Main"
        })
    }
    preload=()=>{
        this.load.image("startButton", "start.png")
        this.load.image("title", "title.png")
        this.scene.add("menu", Menu, false)
        this.scene.add("TestScene", TestScene, false)
    }
    create=()=>{
        // let startButton=this.add.image(0, 0, "startButton")
        // let container=this.add.container(300, 300)
        // let title=this.add.image(300, 50, "title")
        // container.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);
        // container.add(startButton)        
        // container.on("pointerover", function(){
        //     startButton.setTint(0x3366CC);
        // })
        //   container.on("pointerout", function(){
        //     startButton.clearTint();
        // })
        // container.on("pointerup", ()=>{
        //     this.scene.start("TestScene")            
        // })
        let button=new Button(
            this,
            300,
            300,
            "startButton",
            0x3366CC,
            ()=>{
                this.scene.start("TestScene");
            }
        )
        button.render();
    }
}
export default Main;