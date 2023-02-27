// import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "./CoGeomModelLoader";

class LoadingTeam {
    private m_map: Map<string, number> = new Map;
    private m_total = 0;
    private m_loadedTotal = 0;
    urls: string[];
    models: CoGeomDataType[] = [];
    transforms: Float32Array[] = [];
    callback: (models: CoGeomDataType[], transforms: Float32Array[]) => void;
    constructor(urls: string[]) {
        this.init(urls);
    }
    private init(urls: string[]): void {
        this.urls = urls;
        this.m_total = urls.length;
        for(let i = 0; i < this.m_total; ++i) {
            this.m_map.set(urls[i], 0);
        }
    }
    testWithUrl(url: string): boolean {

        let flag = false;
        if(this.m_map.has(url) && this.m_map.get(url) < 1) {
            this.m_map.set(url, 1);
            this.m_loadedTotal ++;
            flag = this.m_loadedTotal >= this.m_total;
            if(flag) {
                this.callback(this.models, this.transforms);
            }
        }
        return flag;
    }
}

class CoModelTeamLoader {
    private m_modelLoader = new CoGeomModelLoader();
    // private m_layouter = new EntityLayouter();
    private m_team: LoadingTeam = null;
    private m_teams: LoadingTeam[] = [];
    private m_enabled = true;
    constructor() {
        this.initialize();
    }
    private initialize(): void {
        this.m_modelLoader.setListener(
            (models: CoGeomDataType[], transforms: Float32Array[]): void => {
                console.log("CoModelTeamLoader, loaded model.");
                // for (let i = 0; i < models.length; ++i) {
                //     this.createEntity(models[i], transforms != null ? transforms[i] : null);
                // }
                if(this.m_team != null) {
                    if(transforms) {
                        this.m_team.transforms = this.m_team.transforms.concat(transforms);
                    }else {
                        for(let i = 0; i < models.length; ++i) {
                            this.m_team.transforms.push(null);
                        }
                    }
                    this.m_team.models = this.m_team.models.concat(models);
                }
            },
            (total: number, url: string): void => {
                console.log("CoModelTeamLoader, loaded model all.");
                // this.m_layouter.layoutUpdate();
                // this.m_layouter.layoutReset();
                let flag = this.m_team.testWithUrl(url);
                this.m_enabled = true;
                this.loadNext();
            });

        // let baseUrl: string = "static/private/";
        // let url = baseUrl + "obj/base.obj";
        // url = baseUrl + "obj/base4.obj";
        // url = baseUrl + "fbx/base4.fbx";
        // // url = baseUrl + "fbx/hat_ok.fbx";
        // // url = baseUrl + "obj/apple_01.obj";
        // console.log("initModel() init...");
        // this.loadModels([url]);
    }
    private loadNext(): void {
        if(this.m_enabled && this.m_teams.length > 0) {
            let team = this.m_teams.shift();
            this.m_modelLoader.load(team.urls);
        }
    }
    load(urls: string[], callback: (models: CoGeomDataType[], transforms: Float32Array[]) => void): void {

        let team = new LoadingTeam(urls);
        team.callback = callback;
        this.m_teams.push(team);
        this.loadNext();
    }
}
export { CoModelTeamLoader };