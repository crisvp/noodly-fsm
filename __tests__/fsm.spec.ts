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
      paramtest: {
        from: 'resolved',
        to: 'rejected',
        callback: async (a: 123, b: 456) => {
          expect(a).toEqual(123);
          expect(b).toEqual(456);
        },
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

  it('passes the correct params', async () => {
    expect(stateMachine.state).toEqual('resolved');
    await stateMachine.dispatch('paramtest', 123, 456);
    expect(stateMachine.state).toEqual('rejected');
  });
});
