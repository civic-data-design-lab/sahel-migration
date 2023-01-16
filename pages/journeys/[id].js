import { useRouter, withRouter } from 'next/router';
import useSWR from 'swr';
import Menu from '../../components/menu';
import DataTab from '../../components/data-tab';
import React, { useState, useRef, useEffect } from 'react';
import TextBox from '../../components/card';
import styles from '../../styles/Journeys.module.css';
import useWindowSize from '../../hooks/useWindowSize';

async function fetcher(params) {
  const [url, id] = params;
  const res = await fetch(`${url}?id=${id}`);
  return res.json();
}
export default function JourneysPage() {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const _id = router.query.id;
  const { data: journey, error } = useSWR(['/api/journeysdata', _id], fetcher);
  const ref = useRef(null);

  useEffect(() => {
    console.log(journey);
  }, [journey]);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  if (error) return <div>Journey not found</div>;
  if (!journey) return <div>loading...</div>;
  return (
    <>
      <Menu />

      <div className={styles.imageContainer}>
        <TextBox posX={1000} posY={100} text={journey.body} />
        <img
          src={journey.imageUrl}
          height={height}
          object-fit="cover"
          object-position="right top"
          className={styles.image}
        />
      </div>
      <DataTab />
    </>
  );
}
