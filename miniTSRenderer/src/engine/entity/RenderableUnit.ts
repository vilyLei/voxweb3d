import { GeometryBuffer } from "../mesh/GeometryBuffer";
import { Material } from "../material/Material";

/**
 * 可被实时渲染器用来渲染的对象
 */
class RenderableUnit {

	geometryBuffer = new GeometryBuffer();
	material = new Material();
	visible = true;

	constructor() {}
	initialize(): void {}
	buildGpuRes(gl: any): void {

		// 构建GPU端几何数据
		this.geometryBuffer.buildGpuRes(gl);
		this.material.buildGpuRes(gl);
	}

	draw(gl: any): void {

		if(this.visible) {

			const gb = this.geometryBuffer;

			if (this.material && gb) {
				this.material.use(gl);
				gb.use(gl);

				gl.drawElements(gl.TRIANGLES, gb.vtxCount, gl.UNSIGNED_SHORT, gb.vtxOffset);
			}
		}
	}
	destroy(force: boolean = true): void {
		const gb = this.geometryBuffer;
		if (gb) {
			if (force) {
				gb.destroy();
			}
			this.geometryBuffer = null;
		}
		if (this.material) {
			if (force) {
				this.material.destroy();
			}
		}
	}
}

export { RenderableUnit };
