import { render, screen } from '@testing-library/react';
import UserList from '../UserList';

test('renders user list component', () => {
  render(<UserList users={{}} />);
  const titleElement = screen.getByText(/users/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders users when passed as props', () => {
  const users = { 1: 'Alice', 2: 'Bob' };
  render(<UserList users={users} />);
  const userElements = screen.getAllByText(/Alice|Bob/);
  expect(userElements.length).toBe(2);
  expect(userElements[0]).toBeInTheDocument();
  expect(userElements[1]).toBeInTheDocument();
});

test('renders no users when passed an empty object', () => {
  render(<UserList users={{}} />);
  const userElements = screen.queryByText(/Alice|Bob/);
  expect(userElements).toBeNull();
});

// Note: Make sure your components have elements like headings, inputs, or buttons with proper text or roles 
// to allow React Testing Library to find them effectively.

// Example commands to run tests:
// npm test: Runs all test files with .test.js or .spec.js extensions.

// The tests use React Testing Library to render the components virtually and interact with them using queries like screen.getByText or screen.getByRole.
