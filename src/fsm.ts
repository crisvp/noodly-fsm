interface Transitions {
  [key: string]: {
    from: string;
    to: string;
    callback: (...args: any[]) => Promise<void>;
  };
}

interface Props {
  states: readonly string[];
  transitions: Transitions;
}

export function defineStateMachine<Def extends Props>(props: Def) {
  type Args<T> = T extends (...args: infer A) => void ? A : never;
  type State = Def['states'][number];
  type Transition = keyof Def['transitions'];
  type Machine = typeof machine;

  async function dispatch<K extends string>(
    this: Machine,
    key: K extends Transition ? K : never,
    ...args: Args<Def['transitions'][K]['callback']>
  ) {
    if (this._state !== props.transitions[key]['from']) {
      throw new Error(`Invalid named state transition (${key}) to ${props['transitions'][key]['to']}.
        Attempted transition from ${this._state}, should be ${props['transitions'][key]['from']}.`);
    }
    const fn = props.transitions[key]['callback'] as unknown as (a: typeof args) => Promise<void>;
    await fn(args);
    this._state = props['transitions'][key]['to'];
  }

  const machine = {
    get state(): State {
      return this._state;
    },
    _state: props.states[0],
    states: props.states,
    transitions: props.transitions,
    dispatch: dispatch,
  };

  return machine;
}
