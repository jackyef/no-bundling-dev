declare global {
  namespace globalThis {
    const h: typeof import('preact').h;
  }

  namespace JSX {
    interface IntrinsicElements extends preact.JSX.IntrinsicElements {}
  }
}
