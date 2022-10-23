/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRunnable from "../../vox/base/IRunnable";
import IRunnableQueue from "./IRunnableQueue";

class Runner {
    prev: Runner = null;
    next: Runner = null;
    flag: number = 0;
    target: IRunnable = null;
    constructor() { }
    reset(): void {
        this.flag = 0;
        this.target = null;
    }
}
class RunnerLinker {
    private m_begin: Runner = null;
    private m_end: Runner = null;

    constructor() {
    }
    destroy(): void {
        this.clear();
    }

    clear(): void {
        this.m_begin = this.m_end = null;
    }

    getBegin(): Runner {
        return this.m_begin;
    }
    isEmpty(): boolean {
        return this.m_begin == this.m_end && this.m_end == null;
    }
    addNode(node: Runner) {
        if (this.m_begin == null) {
            this.m_end = this.m_begin = node;
        }
        else {
            if (this.m_end.prev != null) {
                this.m_end.next = node;
                node.prev = this.m_end;
                this.m_end = node;
            }
            else {
                this.m_begin.next = node;
                node.prev = this.m_end;
                this.m_end = node;
            }
        }
        this.m_end.next = null;
    }

    removeNode(node: Runner): void {
        if (node == this.m_begin) {
            if (node == this.m_end) {
                this.m_begin = this.m_end = null;
            }
            else {
                this.m_begin = node.next;
                this.m_begin.prev = null;
            }
        }
        else if (node == this.m_end) {
            this.m_end = node.prev;
            this.m_end.next = null;
        }
        else {
            node.next.prev = node.prev;
            node.prev.next = node.next;
        }
        node.prev = null;
        node.next = null;
    }
}
export default class RunnableQueue implements IRunnableQueue {

    private m_linker: RunnerLinker = new RunnerLinker();
    private m_freeIds: number[] = [];
    private m_runners: Runner[] = [new Runner()];

    constructor() {

    }
    private getFreeId(): number {

        if (this.m_freeIds.length > 0) {
            return this.m_freeIds.pop();
        }

        let runner: Runner = new Runner();
        runner.flag = this.m_runners.length;
        this.m_runners.push(runner);
        return runner.flag;
    }
    addRunner(runner: IRunnable): void {
        if (runner != null && runner.getRunFlag() < 1) {

            let i: number = this.getFreeId();

            let pr: Runner = this.m_runners[i];
            pr.flag = i;
            pr.target = runner;
            runner.setRunFlag(i);
            this.m_linker.addNode(pr);
        }
    }
    removeRunner(runner: IRunnable): void {
        if (runner != null && runner.getRunFlag() > 0) {

            let i: number = runner.getRunFlag();
            this.m_freeIds.push(i);
            let pr: Runner = this.m_runners[i];
            pr.flag = i;
            pr.target = null;
            runner.setRunFlag(0);
            this.m_linker.removeNode(pr);
        }
    }
    run(): void {

        let ro = this.m_linker.getBegin();
        let next = ro;

        while (next != null) {
            ro = next;
            next = ro.next;
            if (ro.target.isRunning()) {
                ro.target.run();
            }
        }
    }
    destroy(): void {
        let ro = this.m_linker.getBegin();
        let next = ro;
        while (next != null) {
            ro = next;
            next = ro.next;
            ro.target = null;
        }
        this.m_linker.clear();
    }
}