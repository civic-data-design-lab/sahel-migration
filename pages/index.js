import Head from 'next/head';
import Menu from '../components/menu';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import MainMap from './maps/map';
import MapBox from '../components/map/mapBox';
import DataTabToggle from '../components/journey/transect/dataTabToggle';
import DataTab from '../components/journey/transect/dataTab';
const inter = Inter({ subsets: ['latin'] });
import { useAppContext } from '../context/journeys';
import JourneyNav from '../components/map/journeyNav';
import { createContext, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

export const SectionContext = createContext({
  currentSection: null,
  setSection: () => { },
});


export default function Home() {
  const journeys = useAppContext();
  const [currentSection, setSection] = useState(null);
  const sectionValue = { currentSection, setSection };
  const { width } = useWindowSize();

  return (
    <>
      <Head>
        <title>Migrants on the Move</title>
        <meta name="description" content="Risks of West African Migration" />
        <meta name="author" content="Civic Data Design Lab at MIT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
      >
        <SectionContext.Provider value={sectionValue}>
          <Menu journeys={journeys} />
          {/* <h1>HOME</h1> */}
          <MainMap journeys={journeys} />
          {/* <MapBox /> */}
          <JourneyNav journeys={journeys} />
        </SectionContext.Provider>
      </main>
    </>
  );
}
