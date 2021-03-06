import Node from "../Node.js";
import Utils from "../Utils.js";

const vec3 = glMatrix.vec3;

export default class Wolf extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
        this.stepCount = 50;
    }

    update(dt, player) {
        let t = new Date().getMilliseconds();

        if (this.stepCount > 280) {
            this.stepCount = 0;
            this.rotation[1] += Math.PI;
        }
        this.stepCount++;

        const forward = vec3.set(vec3.create(),
            0, 0, Math.cos(this.rotation[1]));

        let acc = vec3.create();
        vec3.add(acc, acc, forward);

        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        const len = vec3.len(this.velocity);
        if (len > this.maxSpeed) {
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / len);
        }
    }

}

Wolf.defaults = {
    velocity         : [0, 0, 0],
    maxSpeed         : 6,
    friction         : 0.2,
    acceleration     : 100
}
