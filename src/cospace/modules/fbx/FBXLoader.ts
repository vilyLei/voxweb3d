
import { FileLoader } from "../loaders/FileLoader";
class FBXLoader {

	private m_loader: FileLoader = new FileLoader();
    constructor() {
    }
    load(url: string): void {

        this.m_loader.load(
            url,
            (buf: ArrayBuffer, url: string): void => {
                
            },
            null,
            (status: number, url: string): void => {
                console.error("loaded ctm mesh data error, url: ", url);
            }
        );
    }
}

export { FBXLoader }