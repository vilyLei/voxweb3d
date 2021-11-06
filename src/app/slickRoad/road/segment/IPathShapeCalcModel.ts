import { PathCurveEditor } from "../PathCurveEditor";
import { SegmentData } from "../segment/SegmentData";

interface IPathShapeCalcModel {
    initialize(pathEditor: PathCurveEditor): void;
    reset(): void;
    slice(begin: number, end: number): SegmentData[];
    build(roadWidth: number): void;
    getSegMeshesTotal(): number;
    destroy(): void;
}

export { IPathShapeCalcModel };