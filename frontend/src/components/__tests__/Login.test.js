import { render, screen, fireEvent, act } from '@testing-library/react';
import Login from '../Login';

test('renders login form', () => {
  render(<Login />);
  const headingElement = screen.getByText(/Bienvenue sur/i);
  const strongElement = screen.getByText(/GELANO/i);
  expect(headingElement).toBeInTheDocument();
  expect(strongElement).toBeInTheDocument();
});

// test('allows user to enter nickname and select channel', async () => {
//   await act(async () => {
//     render(<Login />);
//   });

//   const nicknameInput = screen.getByPlaceholderText(/Entrez votre pseudo/i);
//   fireEvent.change(nicknameInput, { target: { value: 'testuser' } });
//   expect(nicknameInput.value).toBe('testuser');

//   const channelSelect = screen.getByRole('combobox');
//   fireEvent.change(channelSelect, { target: { value: 'testchannel' } });
//   expect(channelSelect.value).toBe('testchannel');
// });

// test('calls onLogin with nickname and channelName when login button is clicked', async () => {
//   const onLoginMock = jest.fn();
//   await act(async () => {
//     render(<Login onLogin={onLoginMock} />);
//   });

//   const nicknameInput = screen.getByPlaceholderText(/Entrez votre pseudo/i);
//   fireEvent.change(nicknameInput, { target: { value: 'testuser' } });

//   const channelSelect = screen.getByRole('combobox');
//   fireEvent.change(channelSelect, { target: { value: 'testchannel' } });

//   const loginButton = screen.getByText(/Rejoindre/i);
//   fireEvent.click(loginButton);

//   expect(onLoginMock).toHaveBeenCalledWith('testuser', 'testchannel');
// });

// test('creates a new channel when create channel button is clicked', async () => {
//   await act(async () => {
//     render(<Login />);
//   });

//   const channelInput = screen.getByPlaceholderText(/Nom de votre channel/i);
//   fireEvent.change(channelInput, { target: { value: 'newchannel' } });

//   const createChannelButton = screen.getByText(/Créer la Channel/i);
//   await act(async () => {
//     fireEvent.click(createChannelButton);
//   });

//   expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/channels', expect.any(Object));
// });

// Note: Make sure your components have elements like headings, inputs, or buttons with proper text or roles 
// to allow React Testing Library to find them effectively.

// Example commands to run tests:
// npm test: Runs all test files with .test.js or .spec.js extensions.

// The tests use React Testing Library to render the components virtually and interact with them using queries like screen.getByText or screen.getByRole.
