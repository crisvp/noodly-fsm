interface Transitions {
  [key: string]: {
    from: string | string[];
    to: string;
    callback: (...args: any[]) => Promise<void>;
  };
}

interface Props {
  states: readonly string[];
  transitions: Transitions;
  mode?: 'early' | 'late';
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
    if (!this.validTransition(props.transitions[key]['from'])) {
      throw new Error(`Invalid named state transition (${key}) to ${props['transitions'][key]['to']}.
        Attempted transition from ${this._state}, should be ${props['transitions'][key]['from']}.`);
    }
    props.mode ??= 'late';
    const fn = props.transitions[key]['callback'] as unknown as (...a: typeof args) => Promise<void>;

    if (props.mode === 'early') this._state = props['transitions'][key]['to'];
    await fn(...args);
    if (props.mode === 'late') this._state = props['transitions'][key]['to'];
  }

  const machine = {
    get state(): State {
      return this._state;
    },
    _state: props.states[0],
    states: props.states,
    transitions: props.transitions,
    dispatch: dispatch,
    validTransition(from: string | string[]) {
      return Array.isArray(from) ? from.includes(this._state) : from === this._state;
    },
  };

  return machine;
}
