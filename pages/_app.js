import '../styles/globals.css';
import { AppWrapper } from '../context/journeys';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
      <Analytics />
    </AppWrapper>
  );
}
