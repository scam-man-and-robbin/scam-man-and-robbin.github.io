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
        this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
    }

    /**
    * Function to set scene with camera and start/play button.
    */
    buildScene() {

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        // Make this scene transparent to see the document background
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        var menu = new UI('homeMenuUI');

        menu.addImage();
        menu.addImgButton('playButton', {
            'imgpath' : "assets/scenes/scam-man-play-btn.png",
            'width' : 0.25,
            'top' : '210px',
            'onclick': () => GAME.goToLevel('RunnerLevel')
        });

    }

}