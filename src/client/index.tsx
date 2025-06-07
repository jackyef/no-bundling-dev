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

render(<App />, document.getElementById('app')!);
