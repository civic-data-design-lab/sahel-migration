import Head from 'next/head';
import Menu from '../components/menu';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import MainMap from './maps/map';
const inter = Inter({ subsets: ['latin'] });
import { useAppContext } from '../context/journeys';
import VignetteChapterNav from '../components/map/vignetteChapterNav';
import React, { createContext, use, useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import Link from "next/link";

export const SectionContext = createContext({
  currentSection: null,
  setSection: () => { },
});


export default function Home() {
  const journeys = useAppContext();
  const [currentSection, setSection] = useState(null);
  const sectionValue = { currentSection, setSection };
  const { width } = useWindowSize();
  const documentHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
  }
  useEffect(() => {
    window.addEventListener("resize", documentHeight)
    documentHeight()
  })

  return (
    <>
      <Head>
        <title>Migrants on the Move</title>
        <meta name="description" content="Risks of West African Migration" />
        <meta name="author" content="Civic Data Design Lab at MIT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/migrantsmove_favicon.ico" />
      </Head>
      <main
      >
        <SectionContext.Provider value={sectionValue}>
          <Menu journeys={journeys} />
          <Link  title="Go to Journey" style={{color:" #463c35", textDecoration: "none"}} href="/journeys/beginning-journey">
            <div className={styles.mapNavigation}>
            <span className="material-symbols-outlined">
              directions_walk
          </span>
            </div>
          </Link>
          {/* <h1>HOME</h1> */}
          <MainMap journeys={journeys} />
          {/* <MapBox /> */}
          <VignetteChapterNav journeys={journeys} />
        </SectionContext.Provider>
      </main>
    </>
  );
}
