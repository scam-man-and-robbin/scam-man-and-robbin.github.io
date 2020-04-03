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
        this.assets.addSound('selectSound', '/assets/sounds/Select_sound.wav');
    }

    /**
    * Function to set scene with camera and start/play button.
    */
    buildScene() {

        // Make this scene transparent to see the document background
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        let menu = new UI('homeMenuUI');
        let click = this.assets.getSound('selectSound');
        menu.addImage('LOGO',{
            'imgpath' : "assets/scenes/scamman_logo.png",
            'width' : 0.7,
            'height' : 0.38,
            'verticalAlignment' : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'top' : Math.floor((GAME.engine.getRenderHeight()*3/100)),
        });
        menu.addImgButton('playButton', {
            'imgpath' : "assets/scenes/Start_v2.png",
            'height' : '60px',
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