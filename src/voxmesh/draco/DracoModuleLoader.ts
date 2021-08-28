
import Vector3D from "../../vox/math/Vector3D";
import { DracoTaskListener } from "../../voxmesh/draco/DracoTask";
import DracoMesh from "../../voxmesh/draco/DracoMesh";
import DracoMeshMaterial from "../../voxmesh/draco/DracoMeshMaterial";
import DracoMeshBuilder from "../../voxmesh/draco/DracoMeshBuilder";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import RendererScene from "../../vox/scene/RendererScene";
import DivLog from "../../vox/utils/DivLog";


export class DracoModuleLoader {

    protected m_rscene: RendererScene = null;
    protected m_dracoMeshLoader: DracoMeshBuilder;
    protected m_scale: number = 1.0;
    protected m_pos: Vector3D = new Vector3D(0.0, -400.0, 0.0);
    protected m_urls: string[] = null;
    protected m_url: string = "";
    constructor() {

    }
    initialize(rscene: RendererScene, dracoMeshLoader: DracoMeshBuilder): void {
        this.m_rscene = rscene;
        this.m_dracoMeshLoader = dracoMeshLoader;
    }
    setScale(scale: number): void {
        this.m_scale = scale;
    }    
    setUrlList(urls: string[]): void {
        this.m_urls = urls;
    }
    setPosition(pos: Vector3D): void {
        this.m_pos.copyFrom( pos );
    }
    setPartsTotal(partsTotal: number): void {
    }
    loadNext(): void {
    }
}

export class DracoWholeModuleLoader extends DracoModuleLoader implements DracoTaskListener {

    constructor() {
        super();

        this.m_urls = [
            //"static/assets/modules/bunny.rawmd",
            //"static/assets/modules/loveass.rawmd",
            //"static/assets/modules/lobster.rawmd"
            //"static/assets/modules/lobster.rawmd"
            //"static/assets/modules/cloST22.rawmd"
            "static/assets/modules/skirt/dracos_41.drc.zip"
        ];
    }
    initialize(rscene: RendererScene, dracoMeshLoader: DracoMeshBuilder): void {
        super.initialize(rscene, dracoMeshLoader);
        dracoMeshLoader.setListener(this);
    }
    private m_scales: number[] = [
        //300.0,
        //  1.0,
        //50
        1
        //1.0
    ];
    private m_posList: Vector3D[] = [
        //new Vector3D(-300.0,0.0,0.0),
        //  new Vector3D(300.0,0.0,300.0),
        //new Vector3D(300.0,0.0,-300.0),
        new Vector3D(0.0, -400.0, 0.0),
        //new Vector3D(300.0,-700.0,0.0),
    ];
    loadNext(): void {
        if (this.m_urls.length > 0) {

            this.m_url = this.m_urls.pop();
            this.m_pos = this.m_posList.pop();
            this.m_scale = this.m_scales.pop();

            this.m_dracoMeshLoader.multiBuffers = this.m_url.indexOf(".rawmd") > 0;
            this.m_dracoMeshLoader.zipParseEnabled = this.m_url.indexOf(".zip") > 0;
            this.m_dracoMeshLoader.load(this.m_url);
        }
    }
    dracoParse(pmodule: any, index: number, total: number): void {
        
        let scale: number = this.m_scale;
        let material: DracoMeshMaterial = new DracoMeshMaterial();
        material.initializeByCodeBuf(false);
        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize([pmodule]);
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMesh(mesh);
        entity.setMaterial(material);
        entity.setScaleXYZ(scale, scale, scale);
        entity.setPosition(this.m_pos);
        this.m_rscene.addEntity(entity);
    }
    dracoParseFinish(modules: any[], total: number): void {
        if (modules.length == 1) {
            console.log("dracoParseFinish modules: ", modules);
            
            let scale: number = this.m_scale;
            let material: DracoMeshMaterial = new DracoMeshMaterial();
            material.initializeByCodeBuf( false );
            let mesh: DracoMesh = new DracoMesh();
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(modules);
            let entity: DisplayEntity = new DisplayEntity();
            entity.setMesh(mesh);
            entity.setMaterial(material);
            entity.setScaleXYZ(scale, scale, scale);
            entity.setPosition(this.m_pos);
            this.m_rscene.addEntity(entity);
        }
        this.loadNext();
    }
}

export class DracoMultiPartsModuleLoader extends DracoModuleLoader implements DracoTaskListener {

    protected m_partsTotal: number = 10;
    protected m_index: number = 0;
    
    constructor() {
        super();
    }
    protected getUrlAt(i: number): string {
        
        if(this.m_urls != null) {
            this.m_url = this.m_urls[i];
        }
        else {
            this.m_url = "static/assets/modules/skirt/dracos_"+ i +".drc.zip";
        }
        return this.m_url;
    }
    initialize(rscene: RendererScene, dracoMeshLoader: DracoMeshBuilder): void {
        super.initialize(rscene, dracoMeshLoader);
        dracoMeshLoader.setListener(this);
    }
    setPartsTotal(partsTotal: number): void {
        this.m_partsTotal = partsTotal;
    }

    loadNext(): void {
        if (this.m_partsTotal > this.m_index) {
            let url: string = this.getUrlAt(this.m_index);
            this.m_index++;
            this.m_dracoMeshLoader.multiBuffers = url.indexOf(".rawmd") > 0;
            this.m_dracoMeshLoader.zipParseEnabled = url.indexOf(".zip") > 0;
            this.m_dracoMeshLoader.load(url);
        }
    }
    dracoParse(pmodule: any, index: number, total: number): void {
        //console.log("parse progress: "+index+"/"+total);
        let scale: number = this.m_scale;
        let mesh: DracoMesh = new DracoMesh();
        mesh.initialize([pmodule]);
        let material: DracoMeshMaterial = new DracoMeshMaterial();
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMesh(mesh);
        entity.setMaterial(material);
        entity.setScaleXYZ(scale, scale, scale);
        entity.setPosition(this.m_pos);
        this.m_rscene.addEntity(entity);
    }
    dracoParseFinish(modules: any[], total: number): void {
        if (modules.length == 1) {
            console.log("dracoParseFinish modules: ", modules);
            let scale: number = this.m_scale;
            let mesh: DracoMesh = new DracoMesh();
            mesh.initialize(modules);
            let material: DracoMeshMaterial = new DracoMeshMaterial();
            let entity: DisplayEntity = new DisplayEntity();
            entity.setMesh(mesh);
            entity.setMaterial(material);
            entity.setScaleXYZ(scale, scale, scale);
            entity.setPosition(this.m_pos);
            this.m_rscene.addEntity(entity);
        }
        this.loadNext();
    }
}
