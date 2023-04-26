import '../styles/globals.css';
import { AppWrapper } from '../context/journeys';
export default function App({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}
