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
        this.assets.addMusic('music', '/assets/musics/SCAM_MAN_background2.wav');
        this.assets.addSound('selectSound', '/assets/sounds/Select_sound.wav');
        this.assets.addSound('splashScreenSound', '/assets/sounds/Winning_Sound.wav', { volume: 0.01, autoplay: true });
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
        menu.addImage('Logo',{
            'imgpath' : "assets/scenes/scam-man-fulltitle-mainpage.png",
            'strech' : BABYLON.GUI.Image.stretch_uniform,
            'width' : 0.7,
            'height' : 0.6,
            'verticalAlignment' : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'top' : '100px' 
        });
        menu.addImgButton('playButton', {
            'imgpath' : "assets/scenes/Start_button.png",
            'width' : 0.25,
            'top' : '210px',
            'onclick': () => {
                click.play();
                GAME.goToLevel('TutorialLevel')
            }
        });

    }

}