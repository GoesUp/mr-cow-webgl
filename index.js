import Application from './common/Application.js';

import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';

import Wolf from "./itemclass/Wolf.js";
import Wolf2 from "./itemclass/Wolf2.js";
import Spikes from "./itemclass/Spikes.js";
import Cow from "./itemclass/Cow.js";


class App extends Application {

    start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json');
        this.w = {"over": false, "first": true, "bad": true};
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene('./items/scene.json');
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        this.physics = new Physics(this.scene);

        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }

            if (node instanceof Wolf) {
                this.wolf1 = node;
            }

            if (node instanceof Wolf2) {
                this.wolf2 = node;
            }

            if (node instanceof Spikes) {
                switch (node.name) {
                    case "spike1":
                        this.spike1 = node;
                    case "spike2":
                        this.spike2 = node;
                    case "spike3":
                        this.spike3 = node;
                }
            }

            if (node instanceof Cow) {
                this.cow = node;
            }
        });

        this.camera.addChild(this.cow);
        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);
    }

    enableCamera() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
        } else {
            this.camera.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.w.over === true) {
            if (this.camera.keys["KeyR"]) {
                location.reload();
            }
            if (this.w.first === true) {
                if (this.w.bad === true) {
                    document.getElementById("im1").src = "gui/death.png";
                    document.getElementById("im2").src = "gui/death.png";
                    let audio = new Audio('./common/sounds/death.mp3');
                    audio.play();
                } else {
                    document.getElementById("im1").src = "gui/win.png";
                    document.getElementById("im2").src = "gui/win.png";
                    let audio = new Audio('./common/sounds/win.mp3');
                    audio.play();
                }
                document.getElementById("im1").style.visibility = "visible";
                document.getElementById("im2").style.visibility = "visible";
                this.w.first = false;
            }
            return
        }

        if (this.camera) {
            this.camera.update(dt, [this.spike1, this.spike2, this.spike3], this.w);
        }

        if (this.wolf1) {
            this.wolf1.update(dt, this.camera);
        }

        if (this.wolf2) {
            this.wolf2.update(dt, this.camera);
        }

        if (this.physics) {
            this.physics.update(dt, this.w);
        }

        if (this.spike1 && this.spike2 && this.spike3) {
            this.spike1.update(dt);
            this.spike2.update(dt);
            this.spike3.update(dt);
        }
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);

    let a = new Image();
    a.src = "gui/win.png";
    a.src = "gui/death.png";

    document.getElementById("imageHolder").addEventListener(
        'click',
        function () {
            app.enableCamera();
            document.getElementById("im1").style.visibility = "hidden";
            document.getElementById("im2").style.visibility = "hidden";
            if (document.getElementById("im1").src === "gui/win.png") location.reload();
        },
        false);
});

let showWin = function() {
    document.getElementById("im1").src = "gui/win.png";
    document.getElementById("im2").src = "gui/win.png";
    document.getElementById("imageHolder").style.visibility = "visible";
    document.getElementById("imageHolder").addEventListener(
        'click',
        function () {
            location.reload();
        },
        false);
}