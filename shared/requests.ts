export type RequestStage = 'QUEUED' | 'WAITING' | 'SUCCESS' | 'ERROR';

export type EntityRequest<R> = {
    id: string;
    version: number;
    entityType: string;
    stage: RequestStage;
    request: R;
};

export type RequestState<R> = {[index: string]: EntityRequest<R>};

