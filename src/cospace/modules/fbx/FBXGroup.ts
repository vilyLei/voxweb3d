class FBXGroup {
    children: any[] = [];
    constructor(){}
    add(model: any): void {

    }
    traverse(callback: (object: any) => any): void {

    }
}
type Group = FBXGroup;
export { Group, FBXGroup }