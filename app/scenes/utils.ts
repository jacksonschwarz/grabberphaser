export class Button{
    targetScene:any;
    x:number;
    y:number;
    resourceKey:string;
    resourceImage:any;
    hoverTint:number | string;
    onClick:()=>void;
    constructor(aTargetScene:any, anX:number, aY:number, aResourceKey:string, aHoverTint:number | string, onClick:()=>void){
        this.targetScene=aTargetScene;
        this.x=anX;
        this.y=aY;
        this.resourceKey=aResourceKey;
        this.hoverTint=aHoverTint;
        this.onClick=onClick;
    }
    render=()=>{
        let container=this.targetScene.add.container(90, 550);
        container.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);
        let button=this.targetScene.add.image(0, 0, this.resourceKey)
        this.resourceImage=button
        container.add(button);
        container.on("pointerover", function(){
          button.setTint(this.hoverTint);
        })
        container.on("pointerout", function(){
          button.clearTint();
        })
        container.on("pointerup", ()=>{
            this.onClick()
        })
    }
    destroy=()=>{
        this.targetScene=null;
        this.x=null;
        this.y=null;
        this.resourceKey=null;
        this.hoverTint=null;
        this.resourceImage.destroy()
    }
}
class ScaleManager {
    canvas;
    mobile:boolean;
    game;
    constructor(game, isMobile) {
        console.log(game)
        console.log(game.canvas);
        this.canvas = game.canvas;
        this.mobile = isMobile;
        this.game = game

        window.addEventListener('resize', () => {
            this.rescale();
            // this.canvas.height=window.outerHeight;
            // this.canvas.width=window.outerWidth;
            if (this.mobile) {
                if (window.innerWidth < window.innerHeight) {
                    this.leaveIncorrectOrientation();
                } else {
                    this.enterIncorrectOrientation();
                }
            }
        });

        this.rescale();
    }

    resize(width, height) {
        this.game.resize(width, height);
        this.game.scene.scenes.forEach(function (scene) {
            scene.cameras.main.setViewport(0, 0, width, height);
            scene.cameras.main.setZoom(this.scale);
        });
        this.rescale();
    }

    rescale() {
        // var orientation = (this.mobile) ? 'left top' : 'center top';
        var orientation = "50% 50%";
        var scale = Math.min(window.innerWidth / this.canvas.width, window.innerHeight / this.canvas.height);
        var usedHeight = this.canvas.height*scale;

        document.body.height = window.innerHeight;

        this.canvas.setAttribute('style', '-ms-transform-origin: ' + orientation + '; -webkit-transform-origin: ' + orientation + ';' +
            ' -moz-transform-origin: ' + orientation + '; -o-transform-origin: ' + orientation + '; transform-origin: ' + orientation + ';' +
            ' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' +
            ' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); ' + 
            ' transform: scale(' + scale + ');' +
            ' display: block; margin: 0; padding: 0; vertical-align: baseline;'
        );
    }

    enterIncorrectOrientation() {
        document.getElementById("orientation").style.display = "block";
        document.getElementById("content").style.display = "none";
    }

    leaveIncorrectOrientation() {
        document.getElementById("orientation").style.display = "none";
        document.getElementById("content").style.display = "block";
    }
}

export default ScaleManager;