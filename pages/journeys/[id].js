import { useRouter, withRouter } from 'next/router';
import useSWR from 'swr';
import Menu from '../../components/menu';
import DataTab from '../../components/dataTab';
import React, { useState, useRef, useEffect } from 'react';

import ImageBox from '../../components/imageBox';
import {fetcher} from "../../hooks/useFetch";
import Navigation from "../../components/navigation";


export default function JourneysPage() {
  const router = useRouter();
  const _id = router.query.id;
  const { data: journeys, errorJourneys } = useSWR(['/api/journeys/journeysdata', 'all'], fetcher);
  const { data: journey, errorJourney } = useSWR(['/api/journeys/journeysdata', _id], fetcher);
  useEffect(() => {
  }, []);

  // const handleSelect = (selectedIndex, e) => {
  //   setIndex(selectedIndex);
  // };

  if (errorJourneys) return <div>Journeys not found</div>;
  if (errorJourney) return <div>Journey not found</div>;
  if (!journeys) return <div>loading...</div>;
  if (!journey) return <div>loading...</div>;
  return (
    <>
      <Menu journeys={journeys}/>
      <Navigation journeys={journeys} journey={journey}/>
      <DataTab />
      <ImageBox journey={journey} id="image-box" />
    </>
  );
}
