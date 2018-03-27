declare module 'quill-delta' {
    import {DeltaOperation, DeltaStatic} from "quill";

    interface DeltaContructor extends DeltaStatic {
        new(ops?: DeltaOperation[] | { ops: DeltaOperation[] }): DeltaStatic;
    }

    let Delta: DeltaContructor;
    export = Delta;
}


