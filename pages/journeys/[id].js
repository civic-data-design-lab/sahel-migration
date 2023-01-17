import { useRouter, withRouter } from 'next/router';
import useSWR from 'swr';
import Menu from '../../components/menu';
import DataTab from '../../components/dataTab';
import React, { useState, useRef, useEffect } from 'react';
import ImageBox from '../../components/imageBox';

async function fetcher(params) {
  const [url, id] = params;
  const res = await fetch(`${url}?id=${id}`);
  return res.json();
}
export default function JourneysPage() {
  const router = useRouter();
  const _id = router.query.id;
  const { data: journey, error } = useSWR(['/api/journeysdata', _id], fetcher);

  useEffect(() => {
    // console.log(journey);
    // console.log(journey.popUps);
  }, [journey]);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  if (error) return <div>Journey not found</div>;
  if (!journey) return <div>loading...</div>;
  return (
    <>
      <Menu />
      <ImageBox journey={journey} id="image-box" />
      <DataTab />
    </>
  );
}
