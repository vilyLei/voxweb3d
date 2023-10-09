
import {Renderer} from "./render/Renderer";
import {RenderableUnit} from "./entity/RenderableUnit";

/**
 * 实时图形示例引擎
 */
class MiniREngine {
    private mCanvas: HTMLCanvasElement = null;
    readonly renderer = new Renderer();
    constructor() {}
    /**
     * 初始化引擎
     * @params config 引擎配置信息,for example: {canvas: htmlCanvas}
     */
    initialize(config: any = null): void {
        // 创建一个可用于绘制画面的区域(在GPU中申请一块显存)
		if(config == null || !config.canvas) {
			this.mCanvas = document.createElement('canvas');
			document.body.appendChild(this.mCanvas);
			this.mCanvas.width = 800;
			this.mCanvas.height = 600;
		}else {
			if(config.canvas) {
				this.mCanvas = config.canvas;
			}
		}
        // 初始化渲染器
        this.renderer.initialize(this.mCanvas);
    }
    addRenderableUnit(unit: RenderableUnit): void {
        this.renderer.addRenderableUnit(unit);
    }
    /**
     * 循环执行绘制出动态画面
     */
    run(): void {
		const rd = this.renderer;
        rd.runBegin();
        rd.run();
        rd.runEnd();
    }
	destroy(): void {
		if(this.mCanvas) {
			this.mCanvas.parentElement.removeChild(this.mCanvas);
			this.mCanvas = null;
			this.renderer.destroy();
		}
	}
}

export { MiniREngine };
