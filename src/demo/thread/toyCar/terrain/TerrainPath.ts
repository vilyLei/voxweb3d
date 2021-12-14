enum TerrainPathStatus {
    /**
     * 在路径上移动
     */
    Moving,
    /**
     * 停止在当前位置
     */
    Stop,
    /**
     * 需要 serach path
     */
    Search,
    /**
     * 正在进行 serach path, 但是还没得到结果
     */
    Searching,
    /**
     * 已经得到 serach path 结果
     */
    Searched
}

class TerrainPath {

    // 起点
    r0: number = 0;
    c0: number = 0;
    // 终点
    r1: number = 4;
    c1: number = 4;

    status: TerrainPathStatus = TerrainPathStatus.Search;
    constructor() { }

    searchPath(): void {
        this.status = TerrainPathStatus.Search;
    }
    searchingPath(): void {
        this.status = TerrainPathStatus.Searching;
    }
    searchedPath(): void {
        this.status = TerrainPathStatus.Searched;
    }
}
export { TerrainPathStatus, TerrainPath }
