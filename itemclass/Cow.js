import Node from "../Node.js";
import Utils from "../Utils.js";

const vec3 = glMatrix.vec3;

export default class Cow extends Node {

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
    }

}

Cow.defaults = {
    velocity         : [0, 0, 0],
    maxSpeed         : 6,
    friction         : 0.2,
    acceleration     : 100
}
