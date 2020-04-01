import UI from '../../base/UI';
import Level from '../../base/Level';

/**
* Class description
*
* To handle Game Launch Screen related Actions.
*/
export default class HomeMenuLevel extends Level {

    /**
    * Function to setup musics and sound assets
    */
    setupAssets() {
        // this.assets.addMusic('music', '/assets/musics/SCAM_MAN_background2.wav');
        this.assets.addSound('selectSound', '/assets/sounds/Select_sound.wav');
        // this.assets.addSound('splashScreenSound', '/assets/sounds/Winning_Sound.wav', { volume: 0.01, autoplay: true });
    }

    /**
    * Function to set scene with camera and start/play button.
    */
    buildScene() {

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        // Make this scene transparent to see the document background
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        var menu = new UI('homeMenuUI');
        var click = this.assets.getSound('selectSound');
        menu.addImage('background',{
            'imgpath' : "assets/scenes/Start_screen_background.png",
            'width' : 1,
            'height' : 1,
        });
        menu.addImage('LOGO',{
            'imgpath' : "assets/scenes/scamman_logo.png",
            'width' : 0.7,
            'height' : 0.38,
            'verticalAlignment' : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'top' : Math.floor((GAME.engine.getRenderHeight()*3/100)),
        });
        menu.addImgButton('playButton', {
            'imgpath' : "assets/scenes/Start_v2.png",
            'height' : GAME.isPad() ? '100px':'60px' ,
            'width' : 0.55,
            'top' : Math.floor((GAME.engine.getRenderHeight()*48/100)),
            'verticalAlignment' : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'onclick': () => {
                BABYLON.Engine.audioEngine.unlock();
                click.play();
                GAME.goToLevel('TutorialLevel')
            }
        });

    }

}