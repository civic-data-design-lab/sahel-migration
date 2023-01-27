import React, { useState } from 'react';
import { useSpring, animated, useTransition, config } from 'react-spring';
import { useRouter } from 'next/router';
import styles from '../styles/Menu.module.css';
import Link from "next/link";
import Card from "./card";
import useSWR from "swr";
import {fetcher} from "../hooks/useFetch";
export default function Menu() {
  const _id = 'all';
  const {data: journeys, error} = useSWR(['/api/journeysdata',_id], fetcher);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRouting = (href) => {
    return async (e) => {
      handleToggle();
      e.preventDefault();
      await delay(200);
      router.push(href);
    };
  };


  const fullscreenMenu = useSpring({
    // opacity: menuOpen ? 1 : 0,
    // config: { tension: 170, friction: 26, precision: 0.01, clamp: true },
    // position: 'fixed',
    // bottom: 0,
    from: { right: "-100%" },
    right: menuOpen ? "0" : "-100%",
    // left: 0,
    // top: 0,
  });
  if (error) return <div>Journey not found</div>;
  if (!journeys) return<></>;
  return (
    <nav>
      <span className={styles.menuContainer}>
        {!menuOpen ? (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span
              class="material-symbols-outlined"
              style={{ color: 'black' }}
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
        <div style={{
                              opacity: menuOpen ? 1 : 0,
                              zIndex: menuOpen? 8:0,
                              transitionTimingFunction: 'ease',
        }} className={styles.screenCover}/>
        <animated.div style={fullscreenMenu} className={styles.navBar}>
          <ul>
            <li>
              <Link className={styles.route} onClick={handleRouting('/')} href="/">
                Map
              </Link>
            </li>
            <li>
              Journey
              <ul>
                {journeys.map((entourage) => (
                  <li key={entourage.id}>
                    <Link className={styles.route} key={entourage.id} href={'/journeys/'+entourage.id}>{entourage.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link className={styles.route} onClick={handleRouting('/about')} href="/about">
                Current Conditions in Libya
              </Link>
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
