import React, { useState } from 'react';
import { useSpring, animated, useTransition, config, easings } from 'react-spring';
import { useRouter } from 'next/router';
import styles from '../styles/Menu.module.css';
import Link from "next/link";
import Card from "./journey/card";
import useSWR from "swr";
import { fetcher } from "../hooks/useFetch";
export default function Menu({ journeys }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRouting = (href) => {
    return async (e) => {
      handleToggle();
      e.preventDefault();
      await router.push(href);
    };
  };


  const fullscreenMenu = useSpring({
    from: { right: "-100%" },
    right: menuOpen ? "0" : "-100%",
  });
  const fullScreenFill = useSpring({
    opacity: menuOpen ? 1 : 0,
  })
  if (!journeys) return <></>;
  return (
    <nav>
      <span className={styles.menuContainer}>
        {!menuOpen ? (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span
              class="material-symbols-outlined"
              style={{ color: 'black', fontSize: '2rem' }}
            >
              menu
            </span>
          </button>
        ) : (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span class="material-symbols-outlined" style={{ color: 'black' }}>
              close
            </span>
          </button>
        )}
      </span>
      <div>
        <animated.div style={fullScreenFill} className={styles.screenCover} />
        <animated.div style={fullscreenMenu} className={styles.navBar}>
          <ul className={styles.listContainer}>
            <li>
              <Link className={styles.route} onClick={handleRouting('/')} href="/">
                Map
              </Link>
            </li>
            <li>
              <span className={styles.route}>Journey</span>
              <ul className={styles.journeyContainer}>
                {journeys.map((journey) => (
                  <li key={journey.id} className={styles.journeyItem}>
                    {/* <span className="material-symbols-outlined"> arrow_forward</span> */}
                    <Link className={styles.route} key={journey.id} onClick={handleRouting('/journeys/' + journey.id)} href={'/journeys/' + journey.id}>{journey.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link className={styles.route} onClick={handleRouting('/about')} href="/data-source">
                About
              </Link>
            </li>
          </ul>
        </animated.div>
      </div>
    </nav>
  );
}
