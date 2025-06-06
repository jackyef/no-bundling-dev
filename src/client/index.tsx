import { h, render } from 'preact';
import { Header } from './components/Header/index.tsx';
import { Hero } from './components/Hero/index.tsx';

const App = () => {
  return (
    <main>
      <Header />
      <Hero />
    </main>
  );
}

// @ts-expect-error
render(<App />, document.getElementById('app'));
