import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";

import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import RendererScene from "../../../vox/scene/RendererScene";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import { MouseInteraction } from "../../../vox/ui/MouseInteraction";
import IGeomModelData from "../../../vox/mesh/IGeomModelData";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import MeshFactory from "../../../vox/mesh/MeshFactory";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import Matrix4 from "../../../vox/math/Matrix4";
import RendererState from "../../../vox/render/RendererState";

export class BakedModelViewer {
	constructor() {}

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_layouter = new EntityLayouter();
	private m_div: HTMLDivElement = null;
	private m_entities: DisplayEntity[] = [];

	private createCurrDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
		let div: HTMLDivElement = document.createElement("div");
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		document.body.appendChild(div);
		div.style.display = "bolck";
		div.style.left = px + "px";
		div.style.top = py + "px";
		div.style.position = "absolute";
		div.style.display = "bolck";
		div.style.position = "absolute";
		div.style.zIndex = '9999';
		this.m_div = div;
		return div;
	}
	getDiv(): HTMLDivElement {
		return this.m_div;
	}
	getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
	}

	initialize(px: number, py: number, pw: number, ph: number): void {

		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			let rparam = new RendererParam(this.createCurrDiv(px, py, pw, ph));
			rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);
			rparam.setAttriAntialias(true);
			rparam.setCamProject(45, 1.0, 8000);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.autoUpdate();
		}
	}

    private m_timeoutId: any = -1;
	clearScene(): void {
		if(this.m_rscene != null) {
			for(let i = 0; i < this.m_entities.length; ++i) {
				this.m_rscene.removeEntity(this.m_entities[i]);
			}
			this.m_entities = [];
			this.m_layouter.layoutReset();
		}
	}
    private autoUpdate(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.autoUpdate.bind(this), 40);// 20 fps

        this.run();
    }
	createTexWithCanvas(canvas: HTMLCanvasElement | HTMLImageElement): IRenderTexture {
		let tex = this.m_rscene.textureBlock.createImageTex2D();
		tex.setDataFromImage(canvas);
		return tex;
	}
	createEntityWithParams(vs: Float32Array, uv: Float32Array, ivs: Uint16Array | Uint32Array, tex: IRenderTexture): void {
		let model: IGeomModelData = {vertices: vs, uvsList: [uv], indices: ivs};
		this.createEntity( model, tex );
	}
	private createEntity(model: IGeomModelData, tex: IRenderTexture): void {

		let material = new Default3DMaterial();
		material.setTextureList([tex]);
		let mesh = MeshFactory.createDataMeshFromModel(model, material);
		let entity = new DisplayEntity();
		entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMesh(mesh);
		entity.setMaterial(material);
		this.m_entities.push( entity );
		this.m_rscene.addEntity(entity);
		this.m_layouter.layoutAppendItem( entity, new Matrix4() );
		this.m_layouter.layoutUpdate();
	}

	run(): void {
		if (this.m_rscene != null) {
			this.m_rscene.run();
		}
	}
}
export default BakedModelViewer;
