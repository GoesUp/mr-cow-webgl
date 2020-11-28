import Node from "../Node.js";
import Utils from "../Utils.js";

const vec3 = glMatrix.vec3;

export default class Spikes extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
        this.direction = 1;
        this.stepCount = 50;
        this.goDown = false;
        this.name = options.name;
    }

    update(dt) {
        let t = new Date().getMilliseconds();

        if (this.goDown) {
            const forward = vec3.set(vec3.create(),
                0, -Math.cos(this.rotation[1]) * this.direction * 0.2, 0);

            let acc = vec3.create();
            vec3.add(acc, acc, forward);

            vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

            const len = vec3.len(this.velocity);
            if (len > this.maxSpeed) {
                vec3.scale(this.velocity, this.velocity, this.maxSpeed / len);
            }
        }
    }

}

Spikes.defaults = {
    velocity         : [0, 0, 0],
    maxSpeed         : 6,
    friction         : 0.2,
    acceleration     : 100
}
