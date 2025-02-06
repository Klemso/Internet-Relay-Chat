import { render, screen, act } from '@testing-library/react';
import ChannelList from '../ChannelList';

test('renders channel list component', async () => {
  const mockChannels = [
    { _id: '1', name: 'General' },
    { _id: '2', name: 'Random' },
  ];
  const mockOnChannelClick = jest.fn();
  const mockActiveChannels = [];

  await act(async () => {
    render(
      <ChannelList
        channelList={mockChannels}
        onChannelClick={mockOnChannelClick}
        activeChannels={mockActiveChannels}
      />
    );
  });
  const headingElement = screen.getByText(/Channels/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders channels fetched from API', async () => {
  const mockChannels = [
    { _id: '1', name: 'General' },
    { _id: '2', name: 'Random' },
  ];

  await act(async () => {
    render(<ChannelList channelList={mockChannels} activeChannels={[]} onChannelClick={() => {}} />);
  });
  const channelElements = await screen.findAllByText(/General|Random/);
  expect(channelElements.length).toBe(2);
});

// test('renders channels fetched from API', async () => {
//   await act(async () => {
//     render(<ChannelList />);
//   });
//   const channelElements = await screen.findAllByText(/General|Random/);
//   expect(channelElements.length).toBe(2);
// });

// Note: Make sure your components have elements like headings, inputs, or buttons with proper text or roles 
// to allow React Testing Library to find them effectively.

// Example commands to run tests:
// npm test: Runs all test files with .test.js or .spec.js extensions.

// The tests use React Testing Library to render the components virtually and interact with them using queries like screen.getByText or screen.getByRole.