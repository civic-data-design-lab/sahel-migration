import React, { useState } from 'react';
import { useSpring, animated, useTransition, config } from 'react-spring';
import { useRouter } from 'next/router';
import styles from '../styles/Menu.module.css';
export default function Menu() {
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
    opacity: menuOpen ? 1 : 0,
    y: menuOpen ? 0 : 1000,
    config: { tension: 170, friction: 26, precision: 0.01, clamp: true },
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  });

  return (
    <nav className={styles.navBar}>
      <span className={styles.menuContainer}>
        {!menuOpen ? (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span
              class="material-symbols-outlined"
              style={{ color: 'var(--brown)' }}
            >
              menu
            </span>
          </button>
        ) : (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span class="material-symbols-outlined" style={{ color: 'white' }}>
              close
            </span>
          </button>
        )}
      </span>
      <div>
        <animated.div style={fullscreenMenu}>
          <ul className={styles.menuSelection}>
            <li>
              <a onClick={handleRouting('/')} href="/">
                HOME
              </a>
            </li>
            <li>
              <a onClick={handleRouting('/about')} href="/about">
                ABOUT
              </a>
            </li>
            <li>
              <a onClick={handleRouting('/credits')} href="/credits">
                CREDITS
              </a>
            </li>
            <li>
              <a onClick={handleRouting('/data-source')} href="/data-source">
                DATA SOURCE
              </a>
            </li>
          </ul>
        </animated.div>
      </div>
    </nav>
  );
}
