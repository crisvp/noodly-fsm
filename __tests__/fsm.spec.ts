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
      reset: {
        from: ['resolved', 'rejected'],
        to: 'pending',
        callback: async () => {},
      },
      paramtest: {
        from: 'resolved',
        to: 'rejected',
        callback: async (a: 123, b: 456) => {
          expect(a).toEqual(123);
          expect(b).toEqual(456);
        },
      },
      expectLate: {
        from: 'pending',
        to: 'resolved',
        callback: async () => {
          expect(stateMachine.state).toEqual('pending');
        },
      },
    },
  };

  const earlyMachineProps = {
    states: ['pending', 'resolved'],
    transitions: {
      expectEarly: {
        from: 'pending',
        to: 'resolved',
        callback: async () => {
          expect(earlyMachine.state).toEqual('resolved');
        },
      },
    },
    mode: 'early',
  } as const;

  const lateMachineProps = {
    states: ['pending', 'resolved'],
    transitions: {
      expectLate: {
        from: 'pending',
        to: 'resolved',
        callback: async () => {
          expect(stateMachine.state).toEqual('pending');
        },
      },
    },
    mode: 'late',
  } as const;

  const stateMachine = defineStateMachine(fsmProps);
  const lateMachine = defineStateMachine(lateMachineProps);
  const earlyMachine = defineStateMachine(earlyMachineProps);

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

  it('throws an error when an invalid transition is attempted', async () => {
    expect(stateMachine.state).toEqual('rejected');
    await expect(stateMachine.dispatch('resolve', 123)).rejects.toThrowError();
  });

  it('does not throw an error when a valid transition (array) is attempted', async () => {
    expect(stateMachine.state).toEqual('rejected');
    await stateMachine.dispatch('reset');
    expect(stateMachine.state).toEqual('pending');
  });

  it('throws an error when an invalid transition (array) is attempted', async () => {
    expect(stateMachine.state).toEqual('pending');
    await expect(stateMachine.dispatch('reset')).rejects.toThrowError();
  });

  it('transitions state after the callback (late machine)', async () => {
    expect(lateMachine.state).toEqual('pending');
    await lateMachine.dispatch('expectLate');
  });

  it('transitions state before the callback (early machine)', async () => {
    expect(earlyMachine.state).toEqual('pending');
    await earlyMachine.dispatch('expectEarly');
  });
});
