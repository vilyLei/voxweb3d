
import {EntityObject} from "./EntityObject";

interface Renderer {
    addEntity(entity:EntityObject, index: number): void;
}

export {Renderer}