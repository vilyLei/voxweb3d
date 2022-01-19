import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";
import RendererParam from "../vox/scene/RendererParam";
import MouseEvent from "../vox/event/MouseEvent";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import RendererScene from "../vox/scene/RendererScene";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import IShaderCodeBuilder from "../vox/material/code/IShaderCodeBuilder";
import ShaderUniformData from "../vox/material/ShaderUniformData";
import ShaderUniform from "../vox/material/ShaderUniform";
import { IShaderCodeWrapper } from "../vox/material/IShaderCodeWrapper";
import ShaderCodeMaterial from "../vox/material/ShaderCodeMaterial";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import RendererDevice from "../vox/render/RendererDevice";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Color4 from "../vox/material/Color4";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";
import { ColorMaterialDecorator } from "../demo/material/ColorMaterialDecorator";

class ShaderCodeWrapper implements IShaderCodeWrapper {

    initialize(): void {

    }
    buildThisCode(codeBuilder: IShaderCodeBuilder): void {

    }
    getFragShaderCode(codeBuilder: IShaderCodeBuilder): string {

        console.log("ShaderCodeWrapper getFragShaderCode()...", codeBuilder);
        codeBuilder.reset();
        codeBuilder.vertMatrixInverseEnabled = true;

        codeBuilder.uniform.addDiffuseMap();

        codeBuilder.addVarying("vec2", "v_uv");
        codeBuilder.addVarying("vec3", "v_nv");
        codeBuilder.addVarying("vec3", "v_viewDir");

        codeBuilder.addVertLayout("vec3", "a_vs");
        codeBuilder.addVertLayout("vec2", "a_uvs");
        codeBuilder.addVertLayout("vec3", "a_nvs");

        codeBuilder.addFragOutput("vec4", "FragColor0");
        codeBuilder.addFragUniform("vec4", "u_color", 0);
        codeBuilder.addFragUniform("vec4", "u_lightParams", 3);

        codeBuilder.useVertSpaceMats(true, true, true);

        codeBuilder.addFragMainCode(
            `
vec3 calcLight(vec3 baseColor, vec3 pLightDir, vec3 lightColor, vec3 specColor) {

    vec3 nvs = (v_nv);
	vec3 viewDir = v_viewDir;
    float nDotL = max(dot(nvs, pLightDir), 0.0);
	baseColor = nDotL * baseColor * lightColor;
	viewDir = normalize(pLightDir + viewDir);
	lightColor = specColor * nDotL * pow(max(dot(nvs, viewDir), 0.0), 32.0);
	return (baseColor * 0.3 + lightColor * 0.7);
}

void main()
{
    vec4 color4 = VOX_Texture2D(u_sampler0, v_uv);
    color4.xyz *= u_color.xyz;
    
    vec3 lightDirec = u_lightParams[0].xyz;
    vec3 lightColor = u_lightParams[1].xyz;
    vec3 lightSpecColor = u_lightParams[2].xyz;

    vec3 destColor = calcLight(
        color4.xyz,
        lightDirec,
        lightColor,
        lightSpecColor
    );
    FragColor0 = vec4(destColor * 0.9 + 0.4 * color4.xyz, 1.0);
}
`
        );
        return codeBuilder.buildFragCode();
    }
    getVertShaderCode(codeBuilder: IShaderCodeBuilder): string {
        codeBuilder.addVertMainCode(
            `
void main(){
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;

    v_viewDir = -normalize(viewPos.xyz);
    v_uv = a_uvs;
    v_nv = normalize(a_nvs * inverse(mat3(viewMat4)));
}
`
        );
        return codeBuilder.buildVertCode();
    }

    createSharedUniforms(): ShaderUniform[] {
        return null;
    }
    getUniqueShaderName(): string {
        return "ShaderCodeWrapperTest01";
    }
}
export class DemoShaderCodeMaterial {
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    constructor() { }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getImageTexByUrl(purl);
    }
    private rendererInit(): void {
        RendererDevice.SHADERCODE_TRACE_ENABLED = true;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

        let rparam: RendererParam = new RendererParam();
        rparam.setCamPosition(800.0, 800.0, 800.0);
        this.m_rscene = new RendererScene();
        this.m_rscene.initialize(rparam, 3);
        this.m_rscene.updateCamera();

        let rscene = this.m_rscene;
        let materialBlock = new RenderableMaterialBlock();
        materialBlock.initialize();
        rscene.materialBlock = materialBlock;
        let entityBlock = new RenderableEntityBlock();
        entityBlock.initialize();
        rscene.entityBlock = entityBlock;

        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);


        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
        this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
        this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
    }

    private m_colorData: Float32Array;
    private m_LightData: Float32Array = null;
    private m_lightDir: Vector3D = new Vector3D(1, 1, 1);
    private m_lightColor: Color4 = new Color4(1, 1, 1);
    private m_lightSpecular: Color4 = new Color4(0.3, 0.2, 0.8,);
    private m_tempV: Vector3D = new Vector3D(1, 1, 1);
    private m_mat4: Matrix4 = new Matrix4();
    initializeTest(): void {

        this.m_LightData = new Float32Array([
            this.m_lightDir.x, this.m_lightDir.y, this.m_lightDir.z, 1.0
            , this.m_lightColor.r, this.m_lightColor.g, this.m_lightColor.b, 1.0
            , this.m_lightSpecular.r, this.m_lightSpecular.g, this.m_lightSpecular.b, 1.0
        ]);


        this.m_mat4.copyFrom(this.m_rscene.getCamera().getViewInvMatrix());
        this.m_mat4.transpose();

        this.m_lightDir.setXYZ(-1.0, -1.0, -1.0);
        this.m_lightDir.normalize();

        let lightUniformData = new ShaderUniformData();
        lightUniformData.uniformNameList = ["u_lightParams"];
        lightUniformData.dataList = [this.m_LightData];

        let colorData: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
        let uniformData = new ShaderUniformData();
        uniformData.uniformNameList = ["u_color"];
        uniformData.dataList = [colorData];
        this.m_colorData = colorData;

        let colorData1: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
        let uniformData1 = new ShaderUniformData();
        uniformData1.uniformNameList = ["u_color"];
        uniformData1.dataList = [colorData1];


        let shaderWrapper: ShaderCodeWrapper = new ShaderCodeWrapper();

        this.createObjs(shaderWrapper, uniformData, [lightUniformData], new Vector3D(), 1.0);
        //this.createObjs(shaderWrapper, uniformData1, [lightUniformData], new Vector3D(0.0, 100.0, 0.0), 0.5);

        //  this.createObjs(shaderWrapper, null, [uniformData], new Vector3D(), 1.0);
        //  this.createObjs(shaderWrapper, null, [uniformData], new Vector3D(0.0,100.0,0.0), 0.5);

    }
    private createObjs(shaderWrapper: ShaderCodeWrapper, selfUniformData: ShaderUniformData, sharedUniformsData: ShaderUniformData[], pos: Vector3D, scale: number): void {

        let material: ShaderCodeMaterial = new ShaderCodeMaterial();
        material.setShaderCodeWrapper(shaderWrapper);
        material.setSelfUniformData(selfUniformData);
        material.setSharedUniformsData(sharedUniformsData);

        let plane = new Plane3DEntity();
        plane.setPosition(pos);
        plane.setScaleXYZ(scale, scale, scale);
        plane.setMaterial(material);
        plane.initializeXOZSquare(700, [this.getImageTexByUrl("static/assets/default.jpg")]);
        this.m_rscene.addEntity(plane);

        let box = new Box3DEntity();
        box.setMaterial(material);
        box.initializeCube(200.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        pos.y += 100.0;
        box.setPosition(pos);
        this.m_rscene.addEntity(box);
    }
    initialize(): void {
        this.rendererInit();

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        // this.initializeTest();

        this.initMaterialDecorator();

    }
    private initMaterialDecorator(): void {

        let box = new Box3DEntity();
        box.initializeCube(200.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        let rscene = this.m_rscene;

        let decorator = new ColorMaterialDecorator();
        decorator.diffuseMap = this.getImageTexByUrl("static/assets/default.jpg");
        decorator.initialize();
        let material = rscene.materialBlock.createMaterial( decorator );

        let srcMesh = box.getMesh();
        let mesh = rscene.entityBlock.createMesh();
        mesh.setVS(srcMesh.getVS());
        mesh.setUVS(srcMesh.getUVS());
        mesh.setIVS(srcMesh.getIVS());
        mesh.setVtxBufRenderData(material);
        mesh.initialize();

        let entity = rscene.entityBlock.createEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        //entity.copyMeshFrom( box );
        this.m_rscene.addEntity(entity);
    }
    private m_flag: boolean = false;
    private m_pos: Vector3D = new Vector3D();
    private mouseDown(): void {
        this.m_flag = true;
        //this.m_colorData[0] = Math.random() * 2;
        //this.m_colorData[1] = Math.random() * 2;
        //this.m_colorData[2] = Math.random() * 2;
    }
    run(): void {
        // if(this.m_flag) {
        //     this.m_flag = false;
        // }
        // else {
        //     return;
        // }

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        if (this.m_LightData != null) {

            this.m_mat4.copyFrom(this.m_rscene.getCamera().getViewInvMatrix());
            this.m_mat4.transpose();
            this.m_mat4.deltaTransformOutVector(this.m_lightDir, this.m_tempV);

            this.m_LightData[0] = -this.m_tempV.x;
            this.m_LightData[1] = -this.m_tempV.y;
            this.m_LightData[2] = -this.m_tempV.z;
        }
        this.m_rscene.run();
    }
}
export default DemoShaderCodeMaterial;