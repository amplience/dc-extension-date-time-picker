import { render } from '@testing-library/svelte';
import App from './App.svelte';

describe('<App>', () => {
  it('renders the current date and time', () => {
    let d = new Date();
    const { getByText } = render(App);
    const dateElement = getByText(new RegExp(d.toLocaleDateString(), 'i'));
    const timeElement = getByText(new RegExp(d.toLocaleTimeString(), 'i'));
    expect(dateElement).toBeInTheDocument();
    expect(timeElement).toBeInTheDocument();
  });
});
