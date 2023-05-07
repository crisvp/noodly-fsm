import { defineStateMachine } from '../src/fsm';

describe('fsm', () => {
  const fsmProps = {
    states: ['pending', 'resolved', 'rejected'] as const,
    transitions: {
      resolve: { from: 'pending', to: 'resolved', callback: async (a: 123) => {} },
      reject: {
        from: 'pending',
        to: 'rejected',
        callback: async (a: 456) => {},
      },
    },
  };

  const stateMachine = defineStateMachine(fsmProps);

  it('initializes with the first state', () => {
    expect(stateMachine.state).toEqual('pending');
  });

  it('changes state when dispatch is called', async () => {
    expect(stateMachine.state).toEqual('pending');
    await stateMachine.dispatch('resolve', 123);
    expect(stateMachine.state).toEqual('resolved');
  });
});
