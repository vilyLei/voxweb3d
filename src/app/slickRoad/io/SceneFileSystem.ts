
import { ExportRoadNode, RoadSceneFile } from "./RoadSceneFile";
import { RoadSceneFileParser } from "./RoadSceneFileParser";
import { RoadEntityBuilder } from "../road/RoadEntityBuilder";
import { PathCurveEditor } from "../road/PathCurveEditor";

class SceneFileSystem {

    private m_pathEditor: PathCurveEditor;
    private m_roadEntityBuilder: RoadEntityBuilder;
    private m_scFile: RoadSceneFile = new RoadSceneFile();
    private m_roadFileParser: RoadSceneFileParser = new RoadSceneFileParser();
    private m_geomSaveEnabled: boolean = true;
    constructor(){
    }

    initialize(pathEditor: PathCurveEditor, roadEntityBuilder: RoadEntityBuilder): void {

        if (this.m_pathEditor == null) {
            this.m_pathEditor = pathEditor;
            this.m_roadEntityBuilder = roadEntityBuilder;
        }
    }
    setSaveGeomEnabled(enabled: boolean): void {
        this.m_geomSaveEnabled = enabled;
    }
    saveData(): void {
        
        if(this.m_pathEditor.getPathKeyPosTotal() > 1) {
            console.log("#### Save Data Begin...");

            let node: ExportRoadNode = new ExportRoadNode();
            node.roadWidth = this.m_pathEditor.getPathWholeWidthFactor();
            node.pathPosList = this.m_pathEditor.getPathKeyPosList();
            node.curvePosList = this.m_pathEditor.getPathCurvePosList();
            
            if(this.m_geomSaveEnabled) {
                node.pathSegList = this.m_roadEntityBuilder.getSegList();
            }
            let fs: Uint8Array = this.m_scFile.buildRoadFile( node );
            this.m_scFile.saveFile(fs);
            // // for test
            // this.m_roadFileParser.parse(fs);
        }
    }
}

export { SceneFileSystem };