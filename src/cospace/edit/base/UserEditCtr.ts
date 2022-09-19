
class UserEditCtr {

    protected m_enabled: boolean = false;
    runningVisible: boolean = true;
    uuid: string = "editCtrl";
    moveSelfEnabled: boolean = true;
    
    enable(): void {
        this.m_enabled = true;
    }
    disable(): void {
        this.m_enabled = false;
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    // run(camera: IRenderCamera, rtv: IVector3D): void;
    isSelected(): boolean {
        return false;
    }
    select(): void {

    }
    deselect(): void {
    }
    setVisible(visible: boolean): void {
    }
    getVisible(): boolean {
        return false;
    }

}

export { UserEditCtr };