
/**
 * 表示子线程中的一个代码模块
 */
interface SubThreadModule {
    dependencyFinish(): void;
    // getDependencies(): string[];
    getTaskClass(): number;
    getUniqueName(): string;
}

export { SubThreadModule };