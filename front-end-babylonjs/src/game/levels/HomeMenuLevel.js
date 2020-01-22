import UI from '../../base/UI';
import Level from '../../base/Level';

export default class HomeMenuLevel extends Level {

    setupAssets() {
        this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
    }

    buildScene() {

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        // Make this scene transparent to see the document background
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        var menu = new UI('homeMenuUI');

        menu.addImage();
        menu.addImgButton('playButton', {
            'onclick': () => GAME.goToLevel('RunnerLevel')
        });

    }

}