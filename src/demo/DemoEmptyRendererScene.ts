import RendererScene from "../vox/scene/RendererScene";

/**
 * A empty RendererScene instance example
 */
export class DemoEmptyRendererScene {
    initialize(): void {
        new RendererScene().initialize().setAutoRunning(true);
    }
}