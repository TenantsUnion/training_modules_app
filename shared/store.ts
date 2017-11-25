// generify payload type as well instead of any
import {Action, ActionContext, Commit, CommitOptions, Mutation, Payload} from 'vuex';

export type MutationType<S, P> = ((state: S, payload: P) => any) & Mutation<S>;
export type ActionType<S, R, P> = ((actionContext: ActionContext<S, R>, payload: P) => any) & Action<S, R>;
export type CommitType<T extends string, P> = Commit & {
    (type: T, payload: P, options?: CommitOptions): void;
    <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}
