import { CoModuleVersion } from "../utils/CoModuleLoader";
import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "./CoGeomModelLoader";

class LoadingTeam {
    private m_map: Map<string, number> = new Map;
    private m_total = 0;
    private m_loadedTotal = 0;
    urls: string[];
	types: string[] = null;
    models: CoGeomDataType[] = [];
    transforms: Float32Array[] = [];
    callback: (models: CoGeomDataType[], transforms: Float32Array[]) => void;
    constructor(urls: string[]) {
        this.init(urls);
    }
    private init(urls: string[]): void {
        this.urls = urls;
        this.m_total = urls.length;
        for (let i = 0; i < this.m_total; ++i) {
            this.m_map.set(urls[i], 0);
        }
    }
    testWithUrl(url: string): boolean {

        let flag = false;
        if (this.m_map.has(url) && this.m_map.get(url) < 1) {
            this.m_map.set(url, 1);
            this.m_loadedTotal++;
            flag = this.m_loadedTotal >= this.m_total;
            if (flag) {
                let callback = this.callback;
                callback(this.models, this.transforms);
                this.callback = null;
            }
        }
        return flag;
    }
}

class CoModelTeamLoader {
    private m_modelLoader = new CoGeomModelLoader();
    private m_team: LoadingTeam = null;
    private m_teams: LoadingTeam[] = [];
    private m_enabled = true;
	verTool: CoModuleVersion = null;
    constructor() {
        this.initialize();
    }
    private initialize(): void {
        this.m_modelLoader.setListener(
            (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat, url?: string): void => {
                // console.log("CoModelTeamLoader, loaded model.");
                if (this.m_team != null) {
                    for (let i = 0; i < models.length; ++i) {
						if(models[i] != null) {
							models[i].url = url;
							if(models[i].vertices != null) {
								if (transforms) {
									this.m_team.transforms.push(transforms[i]);
								}else {
									this.m_team.transforms.push(null);
								}
								this.m_team.models.push(models[i]);
							}
						}
                    }
                }
            },
            (total: number, url: string): void => {
                console.log("CoModelTeamLoader, loaded model all, url: ", url);
                let flag = this.m_team.testWithUrl(url);
                if(flag) {
                    this.m_enabled = true;
                    this.loadNext();
                }
            });
    }
    private loadNext(): void {
        if (this.m_enabled && this.m_teams.length > 0) {
            let team = this.m_teams.shift();
            this.m_team = team;
            this.m_enabled = false;
            console.log("CoModelTeamLoader, begin load urls: ", team.urls, ", team.types: ", team.types);
			if(team.types) {
				this.m_modelLoader.loadWithType(team.urls, team.types);
			}else {
				this.m_modelLoader.load(team.urls);
			}
        }
    }
    load(urls: string[], callback: (models: CoGeomDataType[], transforms: Float32Array[]) => void): void {
        this.m_modelLoader.verTool = this.verTool;
        let team = new LoadingTeam(urls);
        team.callback = callback;
        this.m_teams.push(team);
        this.loadNext();
    }
    loadWithTypes(urls: string[], types: string[], callback: (models: CoGeomDataType[], transforms: Float32Array[]) => void): void {
        this.m_modelLoader.verTool = this.verTool;
        let team = new LoadingTeam(urls);
		team.types = types;
        team.callback = callback;
        this.m_teams.push(team);
        this.loadNext();
    }
    // loadWithTeam(urls: string[], callback: (models: CoGeomDataType[], transforms: Float32Array[]) => void): void {
    // }
}
export { CoModuleVersion, CoGeomDataType, CoModelTeamLoader };
