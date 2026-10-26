// TDD (Jest + React Native Testing Library): npm test
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('says hello and lists the 60 bundled jobs', async () => {
    await render(<App />);
    expect(screen.getByText('Hello, ERI!')).toBeTruthy();
    expect(screen.getByText('60 of 60 jobs')).toBeTruthy();
  });

  it('filters jobs from the labelled search box', async () => {
    await render(<App />);
    await fireEvent.changeText(screen.getByLabelText('Search sample jobs'), 'cook');
    expect(screen.queryByText('60 of 60 jobs')).toBeNull();
  });
});
