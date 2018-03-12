export enum CommandType {
    course = 'COURSE',
    module = 'MODULE',
    section = 'SECTION'
}

export interface CommandMetaData<T extends CommandType> {
    id: string,
    version: number;
    type: T;
    timestamp?: string;
    correlationId?: string; // random id for logging and tracing save command
    userId: string;
}

export interface Command<T extends CommandType, P> {
    metadata: CommandMetaData<T>;
    payload: P;
}

