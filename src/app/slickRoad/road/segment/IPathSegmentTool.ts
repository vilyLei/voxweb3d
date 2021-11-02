import { Pos3D } from "../../base/Pos3D";
import EngineBase from "../../../../vox/engine/EngineBase";
import { PathCurveEditor } from "../PathCurveEditor";
import { SegmentData } from "../segment/SegmentData";

interface IPathSegmentTool {
    initialize(pathEditor: PathCurveEditor): void;
    reset(): void;
    slice(begin: number, end: number): SegmentData[];
    build(roadWidth: number): void;

    destroy(): void;
}

export { IPathSegmentTool };