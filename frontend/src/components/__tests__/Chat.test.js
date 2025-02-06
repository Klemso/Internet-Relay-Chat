// Testing Chat.js

import { render, screen, fireEvent, act } from '@testing-library/react';
import Chat from '../Chat';
import socket from '../../utils/socket';

// Mock the socket module
jest.mock('../../utils/socket', () => ({
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn(),
}));

const mockMessages = [
  { nickname: 'Alice', message: 'Hello' },
  { nickname: 'Bob', message: 'Hi' },
];

const mockUsers = {
  1: 'Alice',
  2: 'Bob',
};

const setup = () => {
  render(<Chat nickname="testuser" channel="testchannel" onLogOut={jest.fn()} />);
};

test('renders chat component', () => {
  setup();
  const inputElement = screen.getByPlaceholderText(/Tapez votre message ou votre \/commande/i);
  expect(inputElement).toBeInTheDocument();
});

// test('renders messages', async () => {
//   setup();
//   await act(async () => {
//     socket.on.mockImplementation((event, callback) => {
//       if (event === 'chatMessage') {
//         callback(mockMessages[0]);
//         callback(mockMessages[1]);
//       }
//     });
//   });

//   const messageElements = await screen.findAllByText(/Hello|Hi/);
//   expect(messageElements.length).toBe(2);
// });

test('sends message on button click', () => {
  setup();
  const inputElement = screen.getByPlaceholderText(/Tapez votre message ou votre \/commande/i);
  const sendButton = screen.getByText(/Envoyer/i);

  fireEvent.change(inputElement, { target: { value: 'Test message' } });
  fireEvent.click(sendButton);

  expect(socket.emit).toHaveBeenCalledWith('chatMessage', {
    nickname: 'testuser',
    message: 'Test message',
    channel: 'testchannel',
  });
});

test('calls onLogOut when logout button is clicked', () => {
  const onLogOutMock = jest.fn();
  render(<Chat nickname="testuser" channel="testchannel" onLogOut={onLogOutMock} />);

  const logoutButton = screen.getByText(/Déconnexion/i);
  fireEvent.click(logoutButton);

  expect(onLogOutMock).toHaveBeenCalled();
});

// test('renders user list', async () => {
//   setup();
//   await act(async () => {
//     socket.on.mockImplementation((event, callback) => {
//       if (event === 'userList') {
//         callback(mockUsers);
//       }
//     });
//   });

//   const userElements = await screen.findAllByText(/Alice|Bob/);
//   expect(userElements.length).toBe(2);
// });

// Note: Make sure your components have elements like headings, inputs, or buttons with proper text or roles 
// to allow React Testing Library to find them effectively.

// Example commands to run tests:
// npm test: Runs all test files with .test.js or .spec.js extensions.

// The tests use React Testing Library to render the components virtually and interact with them using queries like screen.getByText or screen.getByRole.
