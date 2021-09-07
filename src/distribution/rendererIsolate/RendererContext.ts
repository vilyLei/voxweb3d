
import {Camera} from "./Camera";

interface RendererContext {
    
    updateCamera(): void;
    getCamera(): Camera;
}

export {RendererContext}