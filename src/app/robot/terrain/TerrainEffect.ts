import DisplayEntity from "../../../vox/entity/DisplayEntity";
import RendererScene from "../../../vox/scene/RendererScene";
import { ViewTextureMaker } from "../../../renderingtoy/mcase/texture/ViewTextureMaker";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import { SpaceCullingMask } from "../../../vox/space/SpaceCullingMask";
import RendererState from "../../../vox/render/RendererState";
import { RenderModule } from "../scene/RenderModule";
import Vector3D from "../../../vox/math/Vector3D";

class TerrainEffect {

    private m_rscene: RendererScene = null;
    private m_viewTexMaker: ViewTextureMaker = null;

    constructor() { }

    initialize(rscene: RendererScene, fboIndex: number = 1, processIDList: number[] = null): void {
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.init( fboIndex, processIDList);
        }
    }
    getVierTexMaker(): ViewTextureMaker {
        return this.m_viewTexMaker;
    }
    private init(fboIndex: number,  processIDList: number[]): void {

        this.m_viewTexMaker = new ViewTextureMaker(fboIndex);
        this.m_viewTexMaker.setClearColorEnabled(false);
        this.m_viewTexMaker.setCameraViewSize(2400, 2400);
        this.m_viewTexMaker.setMapSize(2048, 2048);
        this.m_viewTexMaker.initialize(this.m_rscene, processIDList);
        this.m_viewTexMaker.upate();
        this.m_viewTexMaker.force = true;
        this.m_viewTexMaker.run();
    }
    
    private m_pv: Vector3D = new Vector3D();
    private m_burnningSpots: DisplayEntity[] = [];
    private m_renderingClips: DisplayEntity[] = [];
    /**
     * 产生 detsroy 效果
     * @param role 被destroy的role
     */
    createDestroyEffect(role: IAttackDst): void {
        let entity: DisplayEntity;
        if(this.m_burnningSpots.length > 20) {
            entity = this.m_burnningSpots.shift();
        }
        else {            
            let tex1 = AssetsModule.GetImageTexByUrl( "static/assets/particle/explosion/explodeBg_01c.png" );
            let tex2 = AssetsModule.GetImageTexByUrl( "static/assets/particle/explosion/explosionCrack01.png" );
            let tex = Math.random() > 0.4 ? tex1 : tex2;

            tex.premultiplyAlpha = true;
            let material = new Default3DMaterial();
            material.premultiplyAlpha = true;
            AssetsModule.UseFogToMaterial(material);
            let color = role.color;
            material.initializeByCodeBuf(true);
            material.setAlpha(0.6);
            material.setTextureList( [tex] );
            material.setRGB3f(color.r, color.g, color.b);
            entity = new DisplayEntity();
            entity.spaceCullMask = SpaceCullingMask.NONE;
            entity.setMaterial( material );
            entity.copyMeshFrom(AssetsModule.GetInstance().unitPlane);
            entity.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
            RenderModule.GetInstance().addBottomParticleEntity(entity);
        }
        
        let pv: Vector3D = this.m_pv;
        role.getPosition(pv);
        pv.y += 2.0;
        let scaleX: number = role.splashRadius + Math.random() * 40 - 20;
        let scaleZ: number = role.splashRadius + Math.random() * 40 - 20;
        entity.setVisible(true);
        let color = role.color;
        (entity.getMaterial() as any).setRGB3f(color.r, color.g, color.b);
        entity.setPosition(pv);
        entity.setScaleXYZ(scaleX, 1.0, scaleZ);
        entity.setRotationXYZ(0.0, Math.random() * 1000.0, 0.0);
        this.m_burnningSpots.push(entity);
        entity.update();
        this.m_renderingClips.push( entity );
    }
    
    run(): void {

        if(this.m_renderingClips.length > 0) {
            let total: number = 0;
            for(let i: number = 0; i < this.m_renderingClips.length; ++i) {
                if(this.m_renderingClips[i].isInRendererProcess()) {
                    total ++;
                }
            }
            if(total >= this.m_renderingClips.length) {
                this.m_viewTexMaker.force = true;
                this.m_viewTexMaker.histroyUpdating = true;
                this.m_viewTexMaker.run();
                for(let i: number = 0; i < this.m_renderingClips.length; ++i) {
                    this.m_renderingClips[i].setVisible( false );
                }
                this.m_renderingClips = [];
            }
        }
    }
}
export {TerrainEffect};