import {DeltaObj} from './modify/convert_delta';

export namespace entity {
    export type TrainingEntity = {
        id: string;
        version: string;
        title: string;
        description: string;
        timeEstimate: string;
        headerDataId: string;
        orderedContentIds: string[];
        orderedQuestionIds: string[];
        orderedContentQuestionIds: string[];
        fieldDeltas: TrainingEntityDeltas
    }

    export interface TrainingEntityDeltas extends DeltaObj {
        title?: Quill.DeltaStatic;
        description?: Quill.DeltaStatic;
        timeEstimate?: Quill.DeltaStatic;
        headerDataId?: Quill.DeltaStatic;
        orderedContentIds?: Quill.DeltaStatic;
        orderedQuestionIds?: Quill.DeltaStatic;
        orderedContentQuestionIds?: Quill.DeltaStatic;

        [index: string]: Quill.DeltaStatic | Quill.DeltaStatic[];
    }

    export interface SaveTrainingEntityCommand {
        id: string,
        version: string,
        fieldDeltas: TrainingEntityDeltas,
        updatedByUserId: string
    }
}