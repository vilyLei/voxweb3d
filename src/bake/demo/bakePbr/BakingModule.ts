(document as any).demoState = 1;
class VVF {
    isEnabled(): boolean {
        return true;
    }
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();
import BakedModelViewer from "./BakedModelViewer";
function createModelViewer(): BakedModelViewer {
	return new BakedModelViewer();
}
export {createModelViewer, BakedModelViewer};
