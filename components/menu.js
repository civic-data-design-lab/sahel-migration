import React, { useState } from 'react';
import { useSpring, animated, useTransition, config } from 'react-spring';
import Link from 'next/link';
export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleToggle = () => {
    setMenuOpen(!menuOpen);
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
    <nav className="navBar">
      <span
        style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          zIndex: 20,
          backgroundColor: 'transparent',
          padding: '1rem',
          font: '4em',
        }}
      >
        {!menuOpen ? (
          <button
            onClick={handleToggle}
            style={{
              background: 'none',
              border: 'none',
              font: 'inherit',
            }}
          >
            <span
              class="material-symbols-outlined"
              style={{ color: 'var(--brown)' }}
            >
              menu
            </span>
          </button>
        ) : (
          <button
            onClick={handleToggle}
            style={{
              background: 'none',
              border: 'none',
              font: 'inherit',
            }}
          >
            <span class="material-symbols-outlined" style={{ color: 'white' }}>
              close
            </span>
          </button>
        )}
      </span>
      <div>
        <animated.div style={fullscreenMenu}>
          <ul
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2rem',
              padding: 0,
              margin: 0,
              backgroundColor: 'var(--brown)',
            }}
          >
            <li>
              <Link href="/">HOME</Link>
            </li>
            <li>
              <Link href="/about">ABOUT</Link>
            </li>
            <li>
              <Link href="/credits">CREDITS</Link>
            </li>
            <li>
              <Link href="/data-source">DATA SOURCE</Link>
            </li>
          </ul>
        </animated.div>
      </div>
    </nav>
  );
}
