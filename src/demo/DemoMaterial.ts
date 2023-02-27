import Vector3D from "../vox/math/Vector3D";
import RendererParam from "../vox/scene/RendererParam";
import ShaderMaterial from "../vox/material/mcase/ShaderMaterial";
import MouseEvent from "../vox/event/MouseEvent";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import RendererScene from "../vox/scene/RendererScene";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

export class DemoMaterial {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_uniformData: Float32Array = null;
    private m_time: number = 0;
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getImageTexByUrl(purl);
    }
    private cylinder: Cylinder3DEntity = null;
    private rendererInit(): void {

        let rparam: RendererParam = new RendererParam();
        rparam.setCamPosition(800.0, 800.0, 800.0);
        this.m_rscene = new RendererScene();
        this.m_rscene.initialize(rparam, 3);
        this.m_rscene.updateCamera();
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

		new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
		new RenderStatusDisplay(this.m_rscene, true);
    }
    initialize(): void {
        this.rendererInit();

        let fragCode: string =
            `
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_colors[2];
varying vec2 v_uvs;
void main()
{
vec4 color4 = texture2D(u_sampler0, v_uvs);
color4 *= u_colors[0];
gl_FragColor = color4 * sin(u_colors[1]);
}
`;
        let vtxCode: string =
            `
precision mediump float;
attribute vec3 a_vs;
attribute vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec2 v_uvs;
void main(){
mat4 viewMat4 = u_viewMat * u_objMat;
vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
gl_Position = u_projMat * viewPos;
v_uvs = a_uvs;
}
`;
        this.m_uniformData = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
        let material: ShaderMaterial = new ShaderMaterial("testShaderMaterial");
        material.setFragShaderCode(fragCode);
        material.setVertShaderCode(vtxCode);
        material.addUniformDataAt("u_colors", this.m_uniformData);

        let cylinder: Cylinder3DEntity = new Cylinder3DEntity();
        cylinder.setMaterial(material);
        cylinder.initialize(100.0, 200.0, 15, [this.getImageTexByUrl("static/assets/tree_scenery.jpg")]);
        //cylinder.setScaleXYZ(0.1,0.1,0.1);
        this.m_rscene.addEntity(cylinder);

        this.cylinder = cylinder;
        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);
    }
    private m_flag: boolean = false;
    private m_pos: Vector3D = new Vector3D();
    private mouseDown(): void {
        this.m_flag = !this.m_flag;
    }
    run(): void {
        if(this.m_rscene != null) {
            // 修改uniform数据
            this.m_time += 1.0;
            this.m_uniformData[0] = Math.abs(Math.sin(this.m_time * 0.01));
            this.m_uniformData[6] = Math.abs(Math.cos(this.m_time * 0.002));
            //  if(this.m_flag)
            //  {
            //      this.cylinder.setPosition(this.m_pos);
            //      this.cylinder.update();
            //      this.m_pos.x = this.m_pos.x;
            //      this.m_pos.y = this.m_pos.y;
            //  }
            // run rendering process (执行渲染过程)         
            this.m_rscene.run();
        }
    }
}
export default DemoMaterial;