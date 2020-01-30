/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Game.js":
/*!*********************!*\
  !*** ./src/Game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Game; });
/* harmony import */ var _base_Log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base/Log.js */ "./src/base/Log.js");
/* harmony import */ var _game_levels_RunnerLevel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game/levels/RunnerLevel.js */ "./src/game/levels/RunnerLevel.js");
/* harmony import */ var _game_levels_HomeMenuLevel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game/levels/HomeMenuLevel.js */ "./src/game/levels/HomeMenuLevel.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Base
 // Game Levels




var Game =
/*#__PURE__*/
function () {
  function Game() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Game);

    /**
     * Sets game options
     */
    this.options = options;
    /**
     * Keyboard pressed keys
     */

    this.keys = {};
    /**
     * Is game paused?
     */

    this.paused = false;
    /**
     * Can be used to log objects and debug the game
     */

    this.log = new _base_Log_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    /**
     * Starts the BABYLON engine on the Canvas element
     */

    this.canvas = document.getElementById("renderCanvas");
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.currentLevel = null;
    this.currentLevelName = 'HomeMenuLevel';
    this.levels = {
      'HomeMenuLevel': new _game_levels_HomeMenuLevel_js__WEBPACK_IMPORTED_MODULE_2__["default"](),
      'RunnerLevel': new _game_levels_RunnerLevel_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  _createClass(Game, [{
    key: "start",
    value: function start() {
      this.listenKeys();
      this.lintenTouchEvents();
      this.listenOtherEvents();
      this.startLevel();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: "isPaused",
    value: function isPaused() {
      return this.paused;
    }
  }, {
    key: "resume",
    value: function resume() {
      this.paused = false;
    }
  }, {
    key: "listenKeys",
    value: function listenKeys() {
      document.addEventListener('keydown', keyDown.bind(this));
      document.addEventListener('keyup', keyUp.bind(this));
      this.keys.up = false;
      this.keys.down = false;
      this.keys.left = false;
      this.keys.right = false;
      this.keys.shoot = false;

      function keyDown(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
          //Arrow Up
          this.keys.shoot = 1;
        } else if (e.keyCode == 65 || e.keyCode == 37) {
          //Arrow Left
          this.keys.left = 1;
        } else if (e.keyCode == 68 || e.keyCode == 39) {
          //Arrow Right
          this.keys.right = 1;
        } else if (e.keyCode == 80 || e.keyCode == 32) {
          //Arrow Right
          this.keys.shoot = 1;
        }
      }

      function keyUp(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
          //Arrow Up
          this.keys.shoot = 0;
        } else if (e.keyCode == 65 || e.keyCode == 37) {
          //Arrow Left
          this.keys.left = 0;
        } else if (e.keyCode == 68 || e.keyCode == 39) {
          //Arrow Right
          this.keys.right = 0;
        } else if (e.keyCode == 80 || e.keyCode == 32) {
          //Arrow Right
          this.keys.shoot = 0;
        }
      }
    }
  }, {
    key: "lintenTouchEvents",
    value: function lintenTouchEvents() {
      var _this = this;

      var hammertime = new Hammer(document.body);
      hammertime.get('swipe').set({
        direction: Hammer.DIRECTION_ALL
      });
      hammertime.on('swipeup', function (ev) {
        _this.keys.shoot = 1; // Resets the key after some milleseconds

        setTimeout(function () {
          _this.keys.shoot = 0;
        }, 150);
      });
      hammertime.on('swipedown', function (ev) {
        _this.keys.down = 1;
        setTimeout(function () {
          _this.keys.down = 0;
        }, 100);
      });
      hammertime.on('swipeleft', function (ev) {
        _this.keys.left = 2;
        setTimeout(function () {
          _this.keys.left = 0;
        }, 150);
      });
      hammertime.on('swiperight', function (ev) {
        _this.keys.right = 2;
        setTimeout(function () {
          _this.keys.right = 0;
        }, 150);
      });
    }
  }, {
    key: "listenOtherEvents",
    value: function listenOtherEvents() {
      var _this2 = this;

      window.addEventListener('blur', function () {
        _this2.pause();
      });
      window.addEventListener('focus', function () {
        _this2.resume();
      });
    }
  }, {
    key: "goToLevel",
    value: function goToLevel(levelName) {
      if (!this.levels[levelName]) {
        console.error('A level with name ' + levelName + ' does not exists');
        return;
      }

      if (this.currentLevel) {
        this.currentLevel.exit();
      }

      this.currentLevelName = levelName;
      this.startLevel();
    }
  }, {
    key: "startLevel",
    value: function startLevel() {
      this.currentLevel = this.levels[this.currentLevelName];
      this.currentLevel.start();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      this.startRenderLoop();
      window.addEventListener("resize", function () {
        _this3.engine.resize();
      });
    }
  }, {
    key: "startRenderLoop",
    value: function startRenderLoop() {
      var _this4 = this;

      this.engine.runRenderLoop(function () {
        _this4.currentLevel.scene.render();
      });
    }
  }, {
    key: "stopRenderLoop",
    value: function stopRenderLoop() {
      this.engine.stopRenderLoop();
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
      }

      return false;
    }
  }]);

  return Game;
}();



/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game.js */ "./src/Game.js");
// The Game main class

window.GAME = null;
var app = {
  init: function init() {
    GAME = new _Game_js__WEBPACK_IMPORTED_MODULE_0__["default"](window.initialGameOptions);
    GAME.start();
  }
};
window.addEventListener('load', function () {
  app.init();
});

/***/ }),

/***/ "./src/base/AssetsDatabase.js":
/*!************************************!*\
  !*** ./src/base/AssetsDatabase.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AssetsDatabase; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AssetsDatabase =
/*#__PURE__*/
function () {
  function AssetsDatabase(scene, finishCallback) {
    _classCallCheck(this, AssetsDatabase);

    this.scene = scene;
    this.meshes = [];
    this.sounds = [];
    this.manager = new BABYLON.AssetsManager(this.scene);

    this.manager.onFinish = function (tasks) {
      if (finishCallback) finishCallback(tasks);
    };
  }
  /**
   * Adds a sound to be loaded
   * @param {*} name 
   * @param {*} file 
   * @param {*} options 
   */


  _createClass(AssetsDatabase, [{
    key: "addSound",
    value: function addSound(name, file, options) {
      var _this = this;

      var fileTask = this.manager.addBinaryFileTask(name + '__SoundTask', file);

      fileTask.onSuccess = function (task) {
        _this.sounds[name] = new BABYLON.Sound(name, task.data, _this.scene, null, options); // Execute a success callback

        if (options.onSuccess) {
          options.onSuccess(_this.sounds[name]);
        }
      };

      return this.sounds[name];
    }
    /**
     * Adds a music (sound with some predefined parametes that can be overwriten)
     * By default, musics are automatically played in loop
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */

  }, {
    key: "addMusic",
    value: function addMusic(name, file) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options.loop = typeof options.loop !== 'undefined' ? options.loop : true;
      options.volume = typeof options.volume !== 'undefined' ? options.volume : 0.5;
      options.autoplay = typeof options.autoplay !== 'undefined' ? options.autoplay : true;
      return this.addSound(name, file, options);
    }
  }, {
    key: "addMesh",
    value: function addMesh() {// To be implemented
    }
  }, {
    key: "getMesh",
    value: function getMesh(name) {
      return this.meshes[name];
    }
  }, {
    key: "getSound",
    value: function getSound(name) {
      return this.sounds[name];
    }
  }, {
    key: "load",
    value: function load() {
      this.manager.load();
    }
  }]);

  return AssetsDatabase;
}();



/***/ }),

/***/ "./src/base/Level.js":
/*!***************************!*\
  !*** ./src/base/Level.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Level; });
/* harmony import */ var _AssetsDatabase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AssetsDatabase */ "./src/base/AssetsDatabase.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Level =
/*#__PURE__*/
function () {
  function Level() {
    _classCallCheck(this, Level);

    /**
     * We can use this object to store materials that can be reused along the game
     */
    this.materials = {};
    this.scene = null;
    this.assets = null;
  }

  _createClass(Level, [{
    key: "start",
    value: function start() {
      GAME.resume();
      GAME.stopRenderLoop();

      if (this.setProperties) {
        this.setProperties();
      } else {
        GAME.log.debugWarning('The setProperties method is recommended to initialize the Level properties');
      }

      this.createScene();
    }
  }, {
    key: "createScene",
    value: function createScene() {
      var _this = this;

      // Create the scene space
      this.scene = new BABYLON.Scene(GAME.engine); // To change bg image based on device

      var imgPath = "/assets/scenes/white_bg.png";

      if (GAME.isMobile()) {
        imgPath = "/assets/scenes/white_bg.png";
      }

      var background = new BABYLON.Layer("back", imgPath, this.scene);
      background.isBackground = true; // Add assets management and execute beforeRender after finish

      this.assets = new _AssetsDatabase__WEBPACK_IMPORTED_MODULE_0__["default"](this.scene, function () {
        GAME.log.debug('Level Assets loaded');

        if (_this.buildScene) {
          _this.buildScene();
        } else {
          GAME.log.debugWarning('You can add the buildScene method to your level to define your scene');
        } // If has the beforeRender method


        if (_this.beforeRender) {
          _this.scene.registerBeforeRender(_this.beforeRender.bind(_this));
        } else {
          GAME.log.debugWarning('You can define animations and other game logics that happends inside the main loop on the beforeRender method');
        }

        GAME.startRenderLoop();
      });

      if (this.setupAssets) {
        this.setupAssets();
      } // Load the assets


      this.assets.load();
      return this.scene;
    }
  }, {
    key: "exit",
    value: function exit() {
      this.scene.dispose();
      this.scene = null;
    }
  }, {
    key: "addMaterial",
    value: function addMaterial(material) {
      this.materials[material.name] = material;
    }
  }, {
    key: "getMaterial",
    value: function getMaterial(materialName) {
      return this.materials[materialName];
    }
  }, {
    key: "removeMaterial",
    value: function removeMaterial(materialName) {
      var material = null;

      if (material = this.materials[materialName]) {
        material.dispose();
        delete this.materials[materialName];
      }
    }
    /**
     * Interpolate a value inside the Level Scene using the BABYLON Action Manager
     * @param {*} target The target object
     * @param {*} property The property in the object to interpolate
     * @param {*} toValue The final value of interpolation
     * @param {*} duration The interpolation duration in milliseconds
     * @param {*} afterExecutionCallback Callback executed after ther interpolation ends
     */

  }, {
    key: "interpolate",
    value: function interpolate(target, property, toValue, duration) {
      var afterExecutionCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      if (!this.scene.actionManager) {
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
      }

      var interpolateAction = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.NothingTrigger, target, property, toValue, duration);
      interpolateAction.onInterpolationDoneObservable.add(function () {
        GAME.log.debug('Interpolation done');
        if (afterExecutionCallback) afterExecutionCallback();
      });
      this.scene.actionManager.registerAction(interpolateAction);
      interpolateAction.execute();
    }
  }]);

  return Level;
}();



/***/ }),

/***/ "./src/base/Log.js":
/*!*************************!*\
  !*** ./src/base/Log.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Log; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Log =
/*#__PURE__*/
function () {
  function Log() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    _classCallCheck(this, Log);

    this.currentID = 0;
    this.logs = [];
    this.enabled = enabled;
  }

  _createClass(Log, [{
    key: "push",
    value: function push() {
      var log = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!this.enabled) return;
      log.ID = ++this.currentID;
      this.logs.push(log);
    }
    /**
     * Simple log method to show what something is doing at moment
     * @param {*} what 
     */

  }, {
    key: "doing",
    value: function doing() {
      var what = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.push({
        'doing': what
      });
    }
  }, {
    key: "getLast",
    value: function getLast() {
      var quantity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.logs.slice(-quantity);
    }
  }, {
    key: "logLast",
    value: function logLast() {
      var quantity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      console.log(this.getLast(quantity));
    }
  }, {
    key: "get",
    value: function get() {
      return this.logs;
    }
  }, {
    key: "log",
    value: function log() {
      console.log(this.logs);
    }
  }, {
    key: "debug",
    value: function debug(data) {
      if (GAME.options.debugMode) {
        console.log('DEBUG LOG: ' + data);
      }
    }
  }, {
    key: "debugWarning",
    value: function debugWarning(data) {
      if (GAME.options.debugMode) {
        console.warn('DEBUG LOG: ' + data);
      }
    }
  }, {
    key: "debugError",
    value: function debugError(data) {
      if (GAME.options.debugMode) {
        console.error('DEBUG LOG: ' + data);
      }
    }
  }]);

  return Log;
}();



/***/ }),

/***/ "./src/base/UI.js":
/*!************************!*\
  !*** ./src/base/UI.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UI; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UI =
/*#__PURE__*/
function () {
  function UI(uiName) {
    _classCallCheck(this, UI);

    this.currentControlID = 0;
    this.controls = [];
    this.menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(uiName);
  }

  _createClass(UI, [{
    key: "addButton",
    value: function addButton(name, text) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var button = new BABYLON.GUI.Button.CreateSimpleButton(name, text);
      button.width = options.width || 0.5;
      button.height = options.height || '60px';
      button.color = options.color || 'black';
      button.outlineWidth = options.outlineWidth || 0;
      button.outlineColor = options.outlineColor || button.color;
      button.background = options.background || 'white';
      button.left = options.left || '0px';
      button.top = options.top || '0px';
      button.textHorizontalAlignment = typeof options.horizontalAlignment !== 'undefined' ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      button.textVerticalAlignment = typeof options.verticalAlignment !== 'undefined' ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

      if (options.onclick) {
        button.onPointerUpObservable.add(options.onclick);
      }

      this.menuTexture.addControl(button);
      this.add(button);
      return button;
    }
  }, {
    key: "addImgButton",
    value: function addImgButton(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var imgbutton = new BABYLON.GUI.Button.CreateImageOnlyButton(name, "assets/scenes/scam-man-play-btn.png");
      imgbutton.width = '0.25';
      imgbutton.height = '0.1';
      imgbutton.thickness = 0;
      imgbutton.top = '210'; // imgbutton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      // imgbutton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

      if (options.onclick) {
        imgbutton.onPointerUpObservable.add(options.onclick);
      }

      this.menuTexture.addControl(imgbutton);
      this.add(imgbutton);
      return imgbutton;
    }
  }, {
    key: "addText",
    value: function addText(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var textControl = new BABYLON.GUI.TextBlock();
      textControl.text = text;
      textControl.color = options.color || 'black';
      textControl.fontSize = options.fontSize || 20;
      textControl.outlineWidth = options.outlineWidth || 0;
      textControl.outlineColor = options.outlineColor || "black";
      textControl.lineSpacing = options.lineSpacing || '5px';
      textControl.left = options.left || '0px';
      textControl.top = options.top || '0px';
      textControl.textHorizontalAlignment = typeof options.horizontalAlignment !== 'undefined' ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      textControl.textVerticalAlignment = typeof options.verticalAlignment !== 'undefined' ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
      textControl.textWrapping = options.wrapping || true;
      this.menuTexture.addControl(textControl);
      this.add(textControl);
      return textControl;
    }
  }, {
    key: "addImage",
    value: function addImage() {
      var img = new BABYLON.GUI.Image("img", "assets/scenes/scam-man-fulltitle-mainpage.png"); // img.width = 0.5;
      // img.height = '50px';

      img.strech = BABYLON.GUI.Image.stretch_uniform;
      img.width = '0.7';
      img.height = '0.6';
      img.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
      img.top = '100';
      this.menuTexture.addControl(img);
      return img;
    }
  }, {
    key: "add",
    value: function add(control) {
      control.uiControlID = this.currentControlID++;
      this.controls.push(control);
    }
  }, {
    key: "remove",
    value: function remove(control) {
      control.isVisible = false;
      this.controls.splice(control.uiControlID, 1);
    }
  }, {
    key: "show",
    value: function show() {
      this.controls.forEach(function (control) {
        return control.isVisible = true;
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      this.controls.forEach(function (control) {
        return control.isVisible = false;
      });
    }
  }]);

  return UI;
}();



/***/ }),

/***/ "./src/game/Player.js":
/*!****************************!*\
  !*** ./src/game/Player.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Player; });
/* harmony import */ var _base_UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/UI */ "./src/base/UI.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Player =
/*#__PURE__*/
function () {
  function Player(level) {
    _classCallCheck(this, Player);

    this.level = level;
    this.scene = level.scene;
    this.changePosition = false;
    this.nextBullet = true;
    this.bullerCounter = 1;
    this.coins = 0;
    this.scamCount = 0;
    this.lives = GAME.options.player.lives;
    this.godMode = GAME.options.player.godMode;
    this.createCommonMaterials();
    this.setupPlayer();
  }

  _createClass(Player, [{
    key: "createCommonMaterials",
    value: function createCommonMaterials() {
      var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
      playerMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#8510d8");
      playerMaterial.emissiveColor = new BABYLON.Color3.FromHexString("#8510d8");
      playerMaterial.specularColor = new BABYLON.Color3.FromHexString("#8510d8"); // Freeze materials to improve performance (this material will not be modified)

      playerMaterial.freeze();
      this.level.addMaterial(playerMaterial);
    }
  }, {
    key: "setupPlayer",
    value: function setupPlayer() {
      this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
        width: 0.4,
        height: 0.8,
        depth: 0.1
      }, this.scene);
      this.mesh.position = new BABYLON.Vector3(0, -3, 0);
      this.mesh.material = this.level.getMaterial('playerMaterial');
      this.changePosition = true;
      this.createHUD();
    }
  }, {
    key: "createHUD",
    value: function createHUD() {
      this.hud = new _base_UI__WEBPACK_IMPORTED_MODULE_0__["default"]('playerHudUI');
      this.coinsTextControl = null;
      this.livesTextControl = null;
      this.coinsTextControl = this.hud.addText('Coins: $0', {
        'top': '10px',
        'left': '10px',
        'fontSize': '15px',
        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      });
      this.livesTextControl = this.hud.addText('Lives: ' + this.lives, {
        'top': '10px',
        'left': '-10px',
        'fontSize': '15px',
        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
      });
    }
  }, {
    key: "keepCoin",
    value: function keepCoin() {
      this.coins++;
      this.coinsTextControl.text = 'Coins: $' + this.coins;
    }
  }, {
    key: "checkLife",
    value: function checkLife() {
      if (this.godMode) return;

      if (this.lives <= 1) {
        this.lives = 0;
        this.livesTextControl.text = 'Lives: ' + this.lives;

        if (this.onDie) {
          this.onDie();
        }
      } else {
        this.lives--;
        this.livesTextControl.text = 'Lives: ' + this.lives;
      }
    }
  }, {
    key: "move",
    value: function move() {
      this.checkDirectionMovement();
      this.checkShoot();
    }
  }, {
    key: "checkDirectionMovement",
    value: function checkDirectionMovement() {
      var _this = this;

      if (GAME.keys.left) {
        if (this.changePosition && this.mesh.position.x > (GAME.isMobile() ? -1 : -2.5)) {
          this.changePosition = false;
          this.mesh.animations = [];
          this.mesh.animations.push(this.createPlayerSideMotion('left', this.mesh.position.x));
          this.scene.beginAnimation(this.mesh, 0, 100, false);
          setTimeout(function () {
            _this.changePosition = true;
          }, 300);
        }
      }

      if (GAME.keys.right) {
        if (this.changePosition && this.mesh.position.x < (GAME.isMobile() ? 1 : 2.5)) {
          this.changePosition = false;
          this.mesh.animations = [];
          this.mesh.animations.push(this.createPlayerSideMotion('right', this.mesh.position.x));
          this.scene.beginAnimation(this.mesh, 0, 100, false);
          setTimeout(function () {
            _this.changePosition = true;
          }, 300);
        }
      }
    }
  }, {
    key: "createPlayerSideMotion",
    value: function createPlayerSideMotion(type, startValue) {
      var playerMotion = new BABYLON.Animation("playerSideMotion", "position.x", this.level.getGameSpeed() * 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys = [];
      var frameCounter = 0,
          value = 0;

      for (var index = 0; index < 5; index++) {
        if (type == 'left') {
          value += GAME.isMobile() ? -0.2 : -0.5;
        } else {
          value += GAME.isMobile() ? 0.2 : 0.5;
        }

        keys.push({
          frame: frameCounter,
          value: startValue + value
        });
        frameCounter += 15;
      }

      playerMotion.setKeys(keys);
      return playerMotion;
    }
  }, {
    key: "checkShoot",
    value: function checkShoot() {
      if (GAME.keys.shoot) {
        var bullet = BABYLON.MeshBuilder.CreateBox("bullet_" + this.bullerCounter++, {
          width: 0.1,
          height: 0.2,
          depth: 0.01
        }, this.scene);
        bullet.position = this.mesh.getAbsolutePosition().clone();
        bullet.material = this.level.getMaterial('playerMaterial');
        bullet.animations = [];
        bullet.animations.push(this.createBulletMotion(bullet.position.y));
        this.scene.beginAnimation(bullet, 0, 1000, false); // Clear bullet after a second

        setTimeout(function () {
          bullet.dispose();
        }, 1500);
      }
    }
  }, {
    key: "createBulletMotion",
    value: function createBulletMotion(startValue) {
      var bulletMotion = new BABYLON.Animation("bulletShoot", "position.y", 400, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys = [];
      var frameCounter = 0,
          value = 0;

      for (var index = 0; index < 40; index++) {
        keys.push({
          frame: frameCounter,
          value: startValue + value
        });
        frameCounter += 15;
        value += 0.7;
      }

      bulletMotion.setKeys(keys);
      return bulletMotion;
    }
  }, {
    key: "getMesh",
    value: function getMesh() {
      return this.mesh;
    }
  }, {
    key: "getPoints",
    value: function getPoints() {
      return this.scamCount;
    }
  }, {
    key: "keepScam",
    value: function keepScam() {
      this.scamCount++;
      this.checkAndSaveRecord(this.scamCount);
    }
  }, {
    key: "checkAndSaveRecord",
    value: function checkAndSaveRecord(points) {
      var lastRecord = 0;
      this.pointsRecord = false;

      if (window.localStorage['last_record']) {
        lastRecord = parseInt(window.localStorage['last_record'], 10);
      }

      if (lastRecord < points) {
        this.pointsRecord = true;
        window.localStorage['last_record'] = points;
      }
    }
  }, {
    key: "hasMadePointsRecord",
    value: function hasMadePointsRecord() {
      return this.pointsRecord;
    }
  }, {
    key: "getLastRecord",
    value: function getLastRecord() {
      return window.localStorage['last_record'] || 0;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.coins = 0;
      this.mesh.position.x = 0;
      this.scamCount = 0;
      this.lives = GAME.options.player.lives;
      this.livesTextControl.text = 'Lives: ' + this.lives;
      this.coinsTextControl.text = 'Coins: $' + this.coins;
    }
  }]);

  return Player;
}();



/***/ }),

/***/ "./src/game/levels/HomeMenuLevel.js":
/*!******************************************!*\
  !*** ./src/game/levels/HomeMenuLevel.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HomeMenuLevel; });
/* harmony import */ var _base_UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base/UI */ "./src/base/UI.js");
/* harmony import */ var _base_Level__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../base/Level */ "./src/base/Level.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var HomeMenuLevel =
/*#__PURE__*/
function (_Level) {
  _inherits(HomeMenuLevel, _Level);

  function HomeMenuLevel() {
    _classCallCheck(this, HomeMenuLevel);

    return _possibleConstructorReturn(this, _getPrototypeOf(HomeMenuLevel).apply(this, arguments));
  }

  _createClass(HomeMenuLevel, [{
    key: "setupAssets",
    value: function setupAssets() {
      this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
    }
  }, {
    key: "buildScene",
    value: function buildScene() {
      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene); // Make this scene transparent to see the document background

      this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      var menu = new _base_UI__WEBPACK_IMPORTED_MODULE_0__["default"]('homeMenuUI');
      menu.addImage();
      menu.addImgButton('playButton', {
        'onclick': function onclick() {
          return GAME.goToLevel('RunnerLevel');
        }
      });
    }
  }]);

  return HomeMenuLevel;
}(_base_Level__WEBPACK_IMPORTED_MODULE_1__["default"]);



/***/ }),

/***/ "./src/game/levels/RunnerLevel.js":
/*!****************************************!*\
  !*** ./src/game/levels/RunnerLevel.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RunnerLevel; });
/* harmony import */ var _base_UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base/UI */ "./src/base/UI.js");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Player */ "./src/game/Player.js");
/* harmony import */ var _base_Level__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../base/Level */ "./src/base/Level.js");
/* harmony import */ var _generators_TilesGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./generators/TilesGenerator */ "./src/game/levels/generators/TilesGenerator.js");
/* harmony import */ var _generators_ScamsGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./generators/ScamsGenerator */ "./src/game/levels/generators/ScamsGenerator.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var RunnerLevel =
/*#__PURE__*/
function (_Level) {
  _inherits(RunnerLevel, _Level);

  function RunnerLevel() {
    _classCallCheck(this, RunnerLevel);

    return _possibleConstructorReturn(this, _getPrototypeOf(RunnerLevel).apply(this, arguments));
  }

  _createClass(RunnerLevel, [{
    key: "setProperties",
    value: function setProperties() {
      this.player = null; // Used for ground tiles generation

      this.tiles = null; // Menu

      this.menu = null;
      this.pointsTextControl = null;
      this.currentRecordTextControl = null;
      this.hasMadeRecordTextControl = null;
    }
  }, {
    key: "setupAssets",
    value: function setupAssets() {
      // Dummy Sounds for Time Being. Needs changing (Or requires providing credits)
      this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
      this.assets.addSound('playerDieSound', '/assets/sounds/game-die.mp3', {
        volume: 0.4
      });
      this.assets.addSound('gotCoinSound', '/assets/sounds/coin-c-09.wav');
      this.assets.addSound('damageSound', '/assets/sounds/damage.wav');
      this.assets.addSound('approachSound', '/assets/sounds/monster.wav');
      this.assets.addSound('attackSound', '/assets/sounds/monster_attack.mp3');
    }
  }, {
    key: "buildScene",
    value: function buildScene() {
      var _this = this;

      this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);
      this.createMenus(); // Sets the active camera

      var camera = this.createCamera();
      this.scene.activeCamera = camera; // Uncomment it to allow free camera rotation

      camera.attachControl(GAME.canvas, true); // Add lights to the scene

      var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), this.scene);
      var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 100, -100), this.scene);
      light1.intensity = 0.9;
      light2.intensity = 0.2;
      this.createPlayer();
      this.tiles = new _generators_TilesGenerator__WEBPACK_IMPORTED_MODULE_3__["default"](this);
      this.tiles.generate();
      setTimeout(function () {
        _this.scams = new _generators_ScamsGenerator__WEBPACK_IMPORTED_MODULE_4__["default"](_this);

        _this.scams.generate();
      }, GAME.options.player.scamStartAfter);
      setInterval(function () {
        _this.setGameSpeed();
      }, 15000);
      this.scene.useMaterialMeshMap = true;
      this.scene.debugLayer.hide(); // this.scene.debugLayer.show();
    }
  }, {
    key: "createMenus",
    value: function createMenus() {
      var _this2 = this;

      this.menu = new _base_UI__WEBPACK_IMPORTED_MODULE_0__["default"]('runnerMenuUI');
      this.pointsTextControl = this.menu.addText('Points: 0', {
        'top': '-150px',
        'color': GAME.options.pointsTextColor,
        'outlineColor': GAME.options.pointsOutlineTextColor,
        'outlineWidth': '2px',
        'fontSize': '40px',
        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
      });
      this.currentRecordTextControl = this.menu.addText('Current Record: 0', {
        'top': '-100px',
        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
      });
      this.hasMadeRecordTextControl = this.menu.addText('You got a new Points Record!', {
        'top': '-60px',
        'color': GAME.options.recordTextColor,
        'fontSize': '20px',
        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
      });
      this.menu.addButton('replayButton', 'Replay Game', {
        'onclick': function onclick() {
          return _this2.replay();
        }
      });
      this.menu.addButton('backButton', 'Return to Home', {
        'top': '70px',
        'onclick': function onclick() {
          return GAME.goToLevel('HomeMenuLevel');
        }
      });
      this.menu.hide();
      this.createTutorialText();
    }
  }, {
    key: "createTutorialText",
    value: function createTutorialText() {
      var _this3 = this;

      var text = GAME.isMobile() ? 'Swipe screen Left/Right to control Scam Man. Swipe Up to Shoot.' : 'Use Arrow Keys to Move & Space to Shoot.'; // Small tutorial text

      var tutorialText = this.menu.addText(text, {
        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
      });
      setTimeout(function () {
        _this3.menu.remove(tutorialText);
      }, 5000);
    }
  }, {
    key: "createCamera",
    value: function createCamera() {
      var camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 0, -8), this.scene); // let camera = new BABYLON.ArcRotateCamera("arcCamera", 0, 0, -8, BABYLON.Vector3.Zero(), this.scene);

      camera.setTarget(BABYLON.Vector3.Zero());
      return camera;
    }
  }, {
    key: "createPlayer",
    value: function createPlayer() {
      var _this4 = this;

      // Creates the player and sets it as camera target
      this.player = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"](this);
      var playerLight = new BABYLON.DirectionalLight("playerLight", new BABYLON.Vector3(1, -2, 1), this.scene);
      playerLight.intensity = 0.3;
      playerLight.parent = this.player.mesh;
      this.scene.shadowGenerator = new BABYLON.ShadowGenerator(32, playerLight);
      this.scene.shadowGenerator.useBlurExponentialShadowMap = true;
      this.scene.shadowGenerator.getShadowMap().renderList.push(this.player.mesh); // Actions when player dies

      this.player.onDie = function () {
        GAME.pause();

        _this4.showMenu();
      };
    }
  }, {
    key: "showMenu",
    value: function showMenu() {
      this.pointsTextControl.text = 'Points: ' + this.player.getPoints();
      this.currentRecordTextControl.text = 'Current Record: ' + this.player.getLastRecord();
      this.menu.show();

      if (this.player.hasMadePointsRecord()) {
        this.hasMadeRecordTextControl.isVisible = true;
      } else {
        this.hasMadeRecordTextControl.isVisible = false;
      }
    }
  }, {
    key: "beforeRender",
    value: function beforeRender() {
      if (!GAME.isPaused()) {
        this.player.move();
      }
    }
  }, {
    key: "replay",
    value: function replay() {
      /**
       * Wee need to dispose the current colliders and tiles on scene to prevent trash objects
       */
      // this.tiles.reset();
      // this.disposeColliders();
      this.player.reset();
      this.speed = GAME.options.player.defaultSpeed;
      this.menu.hide();
      GAME.resume();
    }
  }, {
    key: "getGameSpeed",
    value: function getGameSpeed() {
      return this.speed = this.speed ? this.speed : GAME.options.player.defaultSpeed;
    }
  }, {
    key: "setGameSpeed",
    value: function setGameSpeed() {
      if (!GAME.isPaused()) {
        this.speed += GAME.options.player.increaseSpeedRatio;
      }
    }
  }]);

  return RunnerLevel;
}(_base_Level__WEBPACK_IMPORTED_MODULE_2__["default"]);



/***/ }),

/***/ "./src/game/levels/generators/ScamsGenerator.js":
/*!******************************************************!*\
  !*** ./src/game/levels/generators/ScamsGenerator.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ScamsGenerator; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScamsGenerator =
/*#__PURE__*/
function () {
  function ScamsGenerator(level) {
    _classCallCheck(this, ScamsGenerator);

    this.level = level;
    this.scene = level.scene;
    this.player = level.player;
    this.createCommonMaterials();
    this.scamTypes = ['NORMAL_SCAM', 'ZIG_ZAG' // 'SPLITTER'
    ];
  }

  _createClass(ScamsGenerator, [{
    key: "createCommonMaterials",
    value: function createCommonMaterials() {
      var scamMaterial = new BABYLON.StandardMaterial('scamMaterial', this.scene);
      scamMaterial.diffuseColor = new BABYLON.Color3.Red();
      scamMaterial.emissiveColor = new BABYLON.Color3.Red();
      scamMaterial.specularColor = new BABYLON.Color3.Red(); // Freeze materials to improve performance (this material will not be modified)

      scamMaterial.freeze();
      this.level.addMaterial(scamMaterial);
    }
  }, {
    key: "generate",
    value: function generate() {
      var _this = this;

      // New scams keep generating every 4 second
      setInterval(function () {
        if (!GAME.isPaused()) {
          var scamType = 'NORMAL_SCAM';
          var randomTileTypeNumber = Math.floor(Math.random() * _this.scamTypes.length);
          scamType = _this.scamTypes[randomTileTypeNumber];

          if (scamType == 'NORMAL_SCAM') {
            _this.createScams('NORMAL_SCAM');
          } else if (scamType == 'ZIG_ZAG') {
            _this.createScams('ZIG_ZAG');
          }
        }
      }, 4000);
    }
  }, {
    key: "createScams",
    value: function createScams(type) {
      var _this2 = this;

      // To position scam objects on different lanes randomly Default to Middle Lane
      var randomPositionChooser = Math.floor(Math.random() * 100); // 0 to 100 random number

      var positionX = 0;

      if (randomPositionChooser >= 0 && randomPositionChooser < 30) {
        positionX = GAME.isMobile() ? -1 : -2.5; // Positining on the left
      }

      if (randomPositionChooser >= 30) {
        positionX = 0;
      }

      if (randomPositionChooser >= 60) {
        positionX = GAME.isMobile() ? 1 : 2.5; // Positioning on the right
      }

      var scamDiameter = GAME.isMobile() ? 0.2 : 0.4; // let scams = BABYLON.Mesh.CreateCylinder("scam_"+randomPositionChooser, 0.1, scamDiameter, scamDiameter, 16, 0, this.scene);

      var scams = BABYLON.MeshBuilder.CreateBox("scam_" + randomPositionChooser, {
        width: scamDiameter,
        height: scamDiameter,
        depth: 0.01
      }, this.scene);
      scams.material = this.level.getMaterial('scamMaterial');
      scams.position.x = positionX;
      scams.position.y = 3;
      scams.position.z = 0;

      if (type == 'ZIG_ZAG') {
        scams.animations.push(this.createZigZagScamAnimation(scams));
      } else {
        scams.animations.push(this.createScamAnimation());
      }

      var scamAnimation = this.scene.beginAnimation(scams, 0, 2000, false);
      var trigger = setInterval(function () {
        var playerMesh = _this2.player.getMesh();

        if (scams) {
          var scamMesh = [];

          _this2.scene.meshes.forEach(function (element) {
            if (element['name'].includes("bullet") && !scamMesh.includes(element['name'])) {
              scamMesh.push(element['name']);

              if (element.intersectsMesh(scams, false)) {
                // this.slicer(element)
                // element.material.emissiveColor = new BABYLON.Color3.FromHexString('#ff0000')
                scams.dispose();
                element.visibility = false;

                _this2.player.keepScam();

                clearInterval(trigger);
              }
            }
          });

          if (scams.position.y < playerMesh.position.y + 0.5) {
            console.log("kill");

            _this2.player.checkLife();

            scams.dispose();
            clearInterval(trigger);
          }
        } else {
          clearInterval(trigger);
        }
      }, 5);
      setTimeout(function () {
        scamAnimation.pause();
        scams.dispose();
      }, 10000);
    }
  }, {
    key: "createScamAnimation",
    value: function createScamAnimation() {
      var scamAnimation = new BABYLON.Animation("scamfall", "position.y", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys = [];
      keys.push({
        frame: 0,
        value: 3
      });
      keys.push({
        frame: 15,
        value: 1.5
      });
      keys.push({
        frame: 30,
        value: 0
      });
      keys.push({
        frame: 45,
        value: -1.5
      });
      keys.push({
        frame: 60,
        value: -3
      });
      keys.push({
        frame: 85,
        value: -4.5
      });
      scamAnimation.setKeys(keys);
      return scamAnimation;
    }
  }, {
    key: "createZigZagScamAnimation",
    value: function createZigZagScamAnimation(scams) {
      var scamAnimation = new BABYLON.Animation("scamfall", "position", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys = [];
      var position = scams.position;
      var shift = false;
      var incrementBy = 1;

      for (var index = 0; index < 8; index++) {
        keys.push({
          frame: index * 15,
          value: position
        }); // Shift Right

        if (position.x == (GAME.isMobile() ? 1 : 2.5)) {
          shift = true;
          incrementBy = -1;
        } else if (position.x == -(GAME.isMobile() ? 1 : 2.5)) {
          shift = true;
          incrementBy = 1;
        } else {
          shift = false;
        }

        if (shift) {
          position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 2.5) * incrementBy, -1, 0));
        } else {
          position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 2.5) * incrementBy, -1, 0));
        }
      }

      scamAnimation.setKeys(keys);
      var easingFunction = new BABYLON.CircleEase(); // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT

      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN); // Adding easing function to my animation

      scamAnimation.setEasingFunction(easingFunction);
      return scamAnimation;
    }
  }]);

  return ScamsGenerator;
}();



/***/ }),

/***/ "./src/game/levels/generators/TilesGenerator.js":
/*!******************************************************!*\
  !*** ./src/game/levels/generators/TilesGenerator.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TilesGenerator; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TilesGenerator =
/*#__PURE__*/
function () {
  function TilesGenerator(level) {
    _classCallCheck(this, TilesGenerator);

    this.level = level;
    this.scene = level.scene;
    this.player = level.player;
    this.createCommonMaterials();
  }

  _createClass(TilesGenerator, [{
    key: "createCommonMaterials",
    value: function createCommonMaterials() {
      var coinMaterial = new BABYLON.StandardMaterial('coinMaterial', this.scene);
      coinMaterial.diffuseColor = new BABYLON.Color3.Yellow();
      coinMaterial.emissiveColor = new BABYLON.Color3.Yellow();
      coinMaterial.specularColor = new BABYLON.Color3.Yellow(); // Scam objects

      var hazardMaterial = new BABYLON.StandardMaterial("hazardMaterial", this.scene);
      hazardMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
      hazardMaterial.emissiveColor = new BABYLON.Color3(0, 0, 1);
      hazardMaterial.specularColor = new BABYLON.Color3(0, 0, 1); // Freeze materials to improve performance (this material will not be modified)

      coinMaterial.freeze();
      hazardMaterial.freeze();
      this.level.addMaterial(coinMaterial);
      this.level.addMaterial(hazardMaterial);
    }
  }, {
    key: "generate",
    value: function generate() {
      var _this = this;

      // New coins keep generating every 2 second
      setInterval(function () {
        if (!GAME.isPaused()) {
          _this.createCoins();
        }
      }, 2000);
    }
  }, {
    key: "createCoins",
    value: function createCoins() {
      var _this2 = this;

      // To position scam objects on different lanes randomly Default to Middle Lane
      var randomPositionChooser = Math.floor(Math.random() * 100); // 0 to 100 random number

      var positionX = 0;

      if (randomPositionChooser >= 0 && randomPositionChooser < 30) {
        positionX = GAME.isMobile() ? -1 : -2.5; // Positining on the left
      }

      if (randomPositionChooser >= 30) {
        positionX = 0;
      }

      if (randomPositionChooser >= 60) {
        positionX = GAME.isMobile() ? 1 : 2.5; // Positioning on the right
      }

      var coinDiameter = GAME.isMobile() ? 0.2 : 0.4;
      var coins = BABYLON.Mesh.CreateCylinder("coin", 0.01, coinDiameter, coinDiameter, 16, 0, this.scene);
      coins.material = this.level.getMaterial('coinMaterial');
      coins.position.x = positionX;
      coins.position.y = 3;
      coins.position.z = 0;
      coins.rotation.x = 1.2;
      coins.animations.push(this.createCoinAnimation());
      var coinAnimation = this.scene.beginAnimation(coins, 0, 2000, false);
      var playerMesh = this.player.getMesh();

      if (coins.intersectsMesh(playerMesh, false)) {
        console.log("yes");
        coins.dispose();
        this.player.keepCoin();
      }

      var trigger = setInterval(function () {
        if (coins.position.y < playerMesh.position.y) {
          _this2.player.keepCoin();

          clearInterval(trigger);
        }
      }, 10);
      setTimeout(function () {
        coinAnimation.pause();
        coins.dispose();
      }, 20000);

      if (GAME.isPaused()) {
        coinAnimation.pause();
      }
    }
  }, {
    key: "createCoinAnimation",
    value: function createCoinAnimation() {
      var coinAnimation = new BABYLON.Animation("coinfall", "position.y", this.level.getGameSpeed(), BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys = [];
      keys.push({
        frame: 0,
        value: 3
      });
      keys.push({
        frame: 15,
        value: 1.5
      });
      keys.push({
        frame: 30,
        value: 0
      });
      keys.push({
        frame: 45,
        value: -1.5
      });
      keys.push({
        frame: 60,
        value: -3
      });
      keys.push({
        frame: 85,
        value: -4.5
      });
      coinAnimation.setKeys(keys);
      return coinAnimation;
    }
  }]);

  return TilesGenerator;
}();



/***/ }),

/***/ 0:
/*!**************************!*\
  !*** multi ./src/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\xampp\htdocs\scam-man-and-robbin\front-end-babylonjs\src\app.js */"./src/app.js");


/***/ })

/******/ });