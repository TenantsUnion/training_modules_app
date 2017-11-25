
import {DeltaObjDiff} from './delta/delta';

export interface Entity<T, P> {
    id: string,
    version: string,
    metadata: EntityMetadata<T>,
    payload: P
}

export interface EntityMetadata<T> {
    id: string,
    version: string;
    type: T;
}


export interface EntityCommandMetaData<T> extends EntityMetadata<T> {
    timestamp: string;
    correlationId: string; // random id for logging and tracing save command
    userId: string;
}

export interface EntityCommand<T, P> {
    metadata: EntityCommandMetaData<T>;
    payload: P;
}

export interface SaveEntityCommand<T, P extends DeltaObjDiff> extends EntityCommand<T, P> {
    /**
     * The updates and changes made to the entity to be validated and saved
     */
    payload: P;
}

