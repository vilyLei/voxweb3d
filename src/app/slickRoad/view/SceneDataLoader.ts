import BinaryLoader from "../../../vox/assets/BinaryLoader";
import { RoadSceneData, RoadSceneFileParser, RoadSegment, RoadSegmentMesh, RoadModel } from "../io/RoadSceneFileParser";

class SceneDataLoader {

    constructor() { }
    private m_sceneDataParser: RoadSceneFileParser = new RoadSceneFileParser();
    private m_map: Map<string, ((data: RoadSceneData) => void)> = new Map();
    //private m_loadedCallback: (data: RoadSceneData) => void = null;

    load(url: string, loadedCallback: (data: RoadSceneData) => void): void {

        if(url != "") {
            let loader: BinaryLoader = new BinaryLoader();
            loader.uuid = url;
            this.m_map.set(loader.uuid, loadedCallback);
            loader.load(url, this);
        }
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded the road data.");
        let sceneDataParser: RoadSceneFileParser = new RoadSceneFileParser();
        sceneDataParser.parse(new Uint8Array(buffer));
        let sceneData: RoadSceneData = sceneDataParser.getSceneData();
        console.log("sceneData: ", sceneData);
        let loadedCallback: (data: RoadSceneData) => void = this.m_map.get( uuid );
        this.m_map.delete(uuid);
        if(loadedCallback != null) {
            loadedCallback(sceneData);
        }
    }
    loadError(status: number, uuid: string): void {
    }
}

export { SceneDataLoader };