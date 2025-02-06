import socket from '../../utils/socket';

// Mock the socket.io-client module
jest.mock('socket.io-client', () => {
  const mSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
  return {
    io: jest.fn(() => mSocket),
  };
});

describe('Socket', () => {
//   it('should create a socket instance with the correct URL and options', () => {
//     expect(io).toHaveBeenCalledWith("http://localhost:5000", {
//       autoConnect: false,
//     });
//   });

  it('should call connect method', () => {
    socket.connect();
    expect(socket.connect).toHaveBeenCalled();
  });

  it('should call disconnect method', () => {
    socket.disconnect();
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('should call emit method with correct arguments', () => {
    const event = 'testEvent';
    const data = { key: 'value' };
    socket.emit(event, data);
    expect(socket.emit).toHaveBeenCalledWith(event, data);
  });

  it('should call on method with correct arguments', () => {
    const event = 'testEvent';
    const callback = jest.fn();
    socket.on(event, callback);
    expect(socket.on).toHaveBeenCalledWith(event, callback);
  });
});