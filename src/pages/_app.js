import '@/styles/globals.css'

import PuzzleGeneratorProvider from '@/hooks/usePuzzleGenerator'

export default function App({ Component, pageProps }) {
  return <PuzzleGeneratorProvider><Component {...pageProps} /></PuzzleGeneratorProvider>
}
