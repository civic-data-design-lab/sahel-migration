import { useRouter, withRouter } from 'next/router';
import useSWR from 'swr';
import Menu from '../../components/menu';
import DataTab from '../../components/journey/transect/dataTab';
import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/Journeys.module.css';

import ImageBox from '../../components/journey/imageBox';
import { fetcher } from '../../hooks/useFetch';
import Navigation from '../../components/navigation';
import Title from '../../components/title';

export default function JourneysPage() {
  const router = useRouter();
  const _id = router.query.id;
  const { data: journeys, errorJourneys } = useSWR(['/api/journeys/journeysdata', 'all'], fetcher);
  const { data: journey, errorJourney } = useSWR(['/api/journeys/journeysdata', _id], fetcher);
  useEffect(() => {}, []);

  // const handleSelect = (selectedIndex, e) => {
  //   setIndex(selectedIndex);
  // };

  if (errorJourneys) return <div>Journeys not found</div>;
  if (errorJourney) return <div>Journey not found</div>;
  if (!journeys) return <div>loading...</div>;
  if (!journey) return <div>loading...</div>;

  return (
    <>
      <div id="journey" className={styles.journeyContainer}>
        <div className={styles.gridContainer}>
          <Title />
          <Menu journeys={journeys} />
          <Navigation journeys={journeys} journey={journey}/>
          <DataTab journey={journey} />
          <ImageBox journey={journey} id="image-box" />
        </div>
        <div id="transectTooltip" className="transectTooltip hidden">
          {/* <h4>Combined Risk
                <span id="risk-total" className={styles.labelData}>152/360</span>
            </h4>
            <p className={styles.risk4mi}>Reported Violence
                <span id="risk-4mi" className={styles.labelData}>12</span>
            </p>
            <p className={styles.riskAcled}>Armed Conflict
                <span id="risk-acled" className={styles.labelData}>0</span>
            </p>
            <p className={styles.riskFood}>Food Insecurity
                <span id="risk-food" className={styles.labelData}>40</span>
            </p>
            <p className={styles.riskSmuggler}>Smuggler Assistance
                <span id="risk-smuggler" className={styles.labelData}>0</span>
            </p>
            <p className={styles.riskRemoteness}>Remoteness
                <span id="risk-remoteness" className={styles.labelData}>20</span>
            </p>
            <p className={styles.riskHeat}>Extreme Heat
                <span id="risk-heat" className={styles.labelData}>80</span>
            </p> */}
        </div>
      </div>
    </>
  );
}
