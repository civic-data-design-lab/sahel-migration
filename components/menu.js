import React, { useState } from 'react';
import { useSpring, animated, useTransition, config, easings } from 'react-spring';
import { useRouter } from 'next/router';
import styles from '../styles/Menu.module.css';
import Link from 'next/link';
import Card from './journey/card';
import useSWR from 'swr';
import { fetcher } from '../hooks/useFetch';
import { index } from 'd3';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Title from '../components/title';
import useWindowSize from '../hooks/useWindowSize';
import va from '@vercel/analytics';

export default function Menu({ journeys }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState('about');

  const { width, height } = useWindowSize();
  const router = useRouter();
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
    from: { opacity: 0, pointerEvents: 'none' },
    opacity: menuOpen ? 1 : 0,
    pointerEvents: menuOpen ? 'auto' : 'none',
  });
  const fullScreenFill = useSpring({
    opacity: menuOpen ? 1 : 0,
  });
  if (!journeys) return <></>;
  return (
    <nav>
      <span className={styles.menuContainer}>
        {!menuOpen ? (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span
              className="material-symbols-outlined"
              style={{ color: '#463c35', fontSize: '2rem' }}
            >
              menu
            </span>
          </button>
        ) : (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span
              className="material-symbols-outlined"
              style={{ color: '#463c35', fontSize: '2rem' }}
            >
              close
            </span>
          </button>
        )}
      </span>
      <div>
        {/* <animated.div style={fullScreenFill} className={styles.screenCover} /> */}
        <animated.div style={fullscreenMenu} className={styles.navBar}>
          <Title className={styles.title} />
          <Container fluid className={`w-100 h-100 pt-sm-5 pb-1 ${styles.container}`}>
            <Row className="position-relative h-100 mt-md-4">
              <Col
                xs={12}
                sm={4}
                className={`${styles.nav} h-100 d-flex pt-md-5 mt-md-5 mb-md-5 pb-md-5`}
              >
                <div className="position-fixed mb-md-5 pb-md-5 stickyContainer">
                  <ul className={styles.listContainer}>
                    <li onClick={() => setSelected('about')}>
                      <span className={selected === 'about' ? styles.routeActive : ''}>About</span>
                    </li>

                    <li onClick={() => setSelected('map')}>
                      <span className={selected === 'map' ? styles.routeActive : ''}>Map</span>
                    </li>

                    <li onClick={() => setSelected('journey')}>
                      <span className={selected === 'journey' ? styles.routeActive : ''}>
                        Journey
                      </span>
                    </li>
                  </ul>
                </div>
              </Col>

              {selected === 'about' ? (
                <Col xs={12} sm={7} className="pt-md-5 pb-5">
                  <AboutSection title={'Risks of West African Migration'}>
                    <p className="body-5">
                      Thousands of migrants risk their lives each year to travel from West Africa to Libya, primarily motivated by wage differentials and search for better economic opportunities. The lack of legal and regular pathways for migration often leads to dangerous and deadly journeys across the Sahara Desert and the Mediterranean Sea. Of the estimated 621,000 immigrants in Libya in 2022, over 40% have
                      origins in West Africa (IOM, 2022). In June and July 2021, migrants in Libya
                      were surveyed by the United Nations World Food Programme (WFP) and the
                      International Food Policy Research Institute (IFPRI) with questions pertaining
                      to their place of origin, their journey to Libya, their intentions to move on,
                      and their current economic conditions and food security status. The resulting
                      survey sample consisted of 347 migrants from Economic Community of West
                      African States (ECOWAS) countries in Tripoli and Sabha, with the most from
                      Niger*, Chad, Nigeria, Mali, and Ghana. Migrants on the Move visualizes the
                      combined risks of migrants traveling from West Africa to Libya, along the
                      Central Mediterranean route.
                    </p>
                    <p className="body-5">
                      Migrants traveling in North Africa face significant risks, often resorting to
                      illicit means of traveling with smugglers crossing through treacherous terrain
                      in remote areas. A variety of factors contribute to increased risk during
                      migration, including food insecurity, lack of access to resources, heat
                      exposure, and physical violence and abuses. In an attempt to enter Libya
                      undetected, many migrants cross through the Tenere, a stretch within the
                      Sahara Desert that spans hundreds of kilometers. Many migrants turn to
                      smugglers in order to receive protection and navigation assistance during
                      stretches of the journey, but hiring a smuggler often comes at a high cost and
                      can also leave migrants vulnerable to bribery and extortion. Regardless of
                      their travel means, migrants are at great risk while in transit along the
                      Central Mediterranean route.
                    </p>
                    <p className="body-5">
                      Documenting and analyzing the risks of migration is crucial to better
                      addressing the needs of migrants. The routes of migrants originating from West
                      Africa traveling to Libya were mapped using data provided by the International
                      Organization for Migration (IOM). In parallel to the World Food Programme case
                      studies that dive deeper into irregular migration in Libya and in Mali, the
                      data visualizations shown in Migrants on the Move focus on one route from
                      Bamako, Mali to Tripoli, Libya.
                    </p>
                  </AboutSection>
                  <AboutSection title={'Policy Recommendations'}>
                    <ol>
                      <li>
                        Since the main push factor for migrants to leave their countries of origin
                        is economic wage differentials, the international community should work
                        alongside national governments in developing appropriate policies that
                        facilitate economic and employment opportunities in the country of origin.
                      </li>
                      <li>
                        Given the extremely high levels of risk during transit, including those
                        related to protection and food insecurity, international partners should
                        seek entry points for the provision of needs-based assistance to migrants
                        where possible and feasible. Cash transfers to meet essential needs are
                        recommended where possible and feasible.
                      </li>
                      <li>
                        In locations where migrants settle or use as protracted transit sites, the
                        international community should address food insecurity and other
                        humanitarian requirements, also considering the needs of the host population
                        to avoid potential tensions.
                      </li>
                    </ol>
                  </AboutSection>
                  <AboutSection title={'Report'}>
                    {/* <ul>
                      <li> */}
                    <h5 className="fw-bold">
                      Addressing Irregular Migration through Principled Programmatic Approaches:
                      Examining the West Africa Route and WFP Operations
                    </h5>
                    <h6>Kate Ambler, Alan de Brauw, Eduardo Maruyama, and Sara Moussavi</h6>
                    <h6 className="mt-3">World Food Programme & International Food Policy Research Institute</h6>
                    <p className="body-5">
                      <Link className="font-sans fw-light" 
                        href="https://www.wfp.org/publications/2023-addressing-irregular-migration-through-principled-programmatic-approaches" 
                        rel="noopener noreferrer" 
                        target="_blank" 
                        onClick={() => {
                          va.track('Report');
                        }}
                      >
                        [Download the report]
                      </Link>
                    </p>
                  </AboutSection>
                  <AboutSection title={'Data Analysis and Methodology'}>
                    <p className="body-5">
                      This study focuses on irregular migration from the Economic Community of West
                      African States (ECOWAS) countries traveling to Libya. Quantitative data
                      collection for this study was collected by the International Food Policy
                      Research Institute (IFPRI) in Tripoli and Sabha between June and July 2021,
                      with the goals of better understanding the experiences of migrants in Libya.
                      Screening questions were asked to ensure migrants came from ECOWAS countries
                      and a short survey was conducted including modules on their place of origin,
                      their journey to Libya, whether they intended to move on, current employment,
                      and food security status. The resulting survey sample consisted of 347
                      migrants.*
                    </p>
                    <p className="body-5">
                      The experiences of West African migrants making their journey to Libya, are
                      visualized through mapped migration routes, analyzed migrant risk data, and
                      interactive illustrations of the journey. The data visualized on this website
                      by the Civic Data Design Lab team are described in the methodology and data
                      source notes below.
                    </p>
                    <p className="note">
                      *&ensp;Unfortunately, statistics from Niger are not available for this study
                      due to a programming error in the quantitative survey. Secondary research
                      conducted as part of this project suggests that even if migrants from Niger
                      had been included in the sample, the findings would not materially change.
                    </p>
                    <h5>Migration Map and Routes</h5>
                    <p className="body-5">
                      Migration routes visualized on this website focus on migrants originating from
                      ECOWAS countries that travel through the Central Mediterranean route to reach
                      Tripoli and Sabha in Libya.
                    </p>
                    <ul>
                      <li className="mb-2">
                        <h6>Migration routes from West Africa to Libya</h6>
                        <p className="body-5">
                          Migration routes are mapped using origin and destination locations from
                          the Displacement Tracking Matrix data collected by the International
                          Organization for Migration (IOM). The{' '}
                          <Link
                            href="https://dtm.iom.int/report-product-series/flow-monitoring-survey"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Flow Monitoring Survey
                          </Link>{' '}
                          data collected by IOM contains over 26,000 origin and destination
                          locations of migrants traveling through West Africa between July
                          2020&ndash;June 2022; roughly 80% of these survey responses could be
                          mapped using the{' '}
                          <Link
                            href="https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            ESRI geocoding service
                          </Link>
                          . These routes show the most efficient paths between the origin in West
                          Africa and the intended destination in Tripoli, Libya computed using the{' '}
                          <Link
                            href="https://project-osrm.org/"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Open Source Routing Machine
                          </Link>
                          .
                        </p>
                      </li>
                      <li className="mb-2">
                        <h6>Migrants surveyed by place of origin</h6>
                        <p className="body-5">
                          Migrants from Economic Community of West African States (ECOWAS) countries
                          were surveyed in Libya (Tripoli and Sabha) in June and July 2021 by the
                          International Food Policy Research Institute; this survey included
                          location data on the origin cities and countries of West African migrants.
                        </p>
                      </li>
                      <li className="mb-2">
                        <h6>Number of migrants along the route</h6>
                        <p className="body-5">
                          Based on the Displacement Tracking Matrix Flow Monitoring Survey data
                          collected by the International Organization for Migration in West Africa
                          from July 2021-June 2022, this data represents the relative number of
                          migrants that pass through a given segment along the route using the most
                          efficient travel routes from the Open Source Routing Machine.
                        </p>
                      </li>
                    </ul>
                    <h5>Migration Risk</h5>
                    <p className="body-5">
                      Migrants are always at risk while in transit. The migration risk score is a
                      relative scale from 0-100 that indicates variations of extreme risks with
                      higher values, and is a composite of six risk factors, including: migrant
                      reported violence incidents, conflict events, food insecurity, reliance on
                      smugglers, remoteness, and heat exposure. These risk factors are initially
                      weighted evenly, but we invite users to explore the risks further to reflect
                      weights that could appropriately reflect the risks that migrants face while on
                      the move.
                    </p>
                    <p className="body-5">
                      These six risk factors are not inclusive of all of the risks that migrants
                      face during their journeys. There are limitations on the data available to
                      reflect migrant risks; further details on each risk identified can be found
                      below.
                    </p>
                    <ul>
                      <li className="mb-2">
                        <h6>Reported Violence</h6>
                        <p className="body-5">
                          Migrant reported locations and incidents of death, sexual violence,
                          kidnapping, and physical violence. This 4Mi is based on around 48,000
                          interviews with refugees and migrants conducted in Africa, collected by
                          the Mixed Migration Centre between 2018-2022. Locations from this dataset
                          were geolocated by place names and aggregated by incident counts within 50
                          km along the migration route.
                        </p>
                      </li>
                      <li className="mb-2">
                        <h6>Armed Conflict</h6>
                        <p className="body-5">
                          Armed Conflict Location & Event Data of dates, locations, fatalities, and
                          types of all reported political violence and protest events from 2021.
                          Conflict events may not be specifically related to the migrant population,
                          and data was aggregated by the sum of incident counts within a 50km radius
                          of the route.
                        </p>
                      </li>
                      <li className="mb-2">
                        <h6>Food Insecurity</h6>
                        <p className="body-5">
                          Integrated Food Security Phase Classification (IPC) and Cadre Harmonisé
                          data on regional food insecurity in 2021. The IPC Classification System
                          distinguishes acute food insecurity across five severity phases:
                          minimal/none, stressed, crisis, emergency, catastrophe/famine. Food
                          insecurity data that specifically pertains to migrants intransit is not
                          available and difficult to collect. The IPC food insecurity data reflects
                          the local resident populations, and may not specifically relate to the
                          migrants in transit; however, local food insecurity may compound to added
                          risks of migrants as they pass through the area.
                        </p>
                      </li>
                      <li className="mb-2">
                        <h6>Reliance on Smuggler</h6>
                        <p className="body-5">
                          Irregular migrants tend to rely on smugglers more when traveling through
                          areas that restrict freedom of movement, approaching border crossings, and
                          traveling through areas with a perceived need for protection. Risk values
                          were assigned based on the Civic Data Design Lab team’s research and
                          external reporting to address areas along the route where migrants are
                          more likely to rely on smugglers, using the ESRI Africa Boundaries
                          dataset.
                        </p>
                      </li>
                      <li className="mb-2">
                        <h6>Remoteness</h6>
                        <p className="body-5">
                          Remoteness data serves as a proxy for the lack of access to water, food,
                          healthcare, and other resources. This dataset visualizes the driving time
                          access to the nearest city based on the ESRI World Cities dataset and
                          Travel Time tool.
                        </p>
                      </li>
                      <li className="mb-2">
                        <h6>Heat Exposure</h6>
                        <p className="body-5">
                          Many migrants encounter dehydration and exposure to extreme heat. This
                          dataset shows the average of daily maximum temperatures from the MERRA2
                          satellite data in 2022 in regions that are categorized as barren or
                          sparsely vegetated in the ESRI Africa Land Cover dataset. Although
                          temperatures may fluctuate seasonally and temporally throughout a given
                          day, barren or sparsely vegetated areas, such as in the Sahara Desert,
                          provide less shelter and shading protection from extreme heat.
                        </p>
                      </li>
                    </ul>
                  </AboutSection>
                  <AboutSection title={'Data Sources'}>
                    <ul className="body-5">
                      <li>
                        International Food Policy Research Institute. (June&ndash;July 2021).{' '}
                        <span className="fst-italic">
                          Survey of Irregular Migrants in Libya 2021
                        </span>
                        .{' '}
                        <Link
                          className="font-sans fw-light"
                          href=""
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [IFPRI]
                        </Link>
                      </li>
                      <li>
                        International Organization for Migration. (July 2020&ndash;June 2022).
                        <span className="fst-italic">
                          Displacement Tracking Matrix (DTM), Flow Monitoring Survey
                        </span>
                        .{' '}
                        <Link
                          className="font-sans fw-light"
                          href="https://dtm.iom.int/datasets"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [DTM datasets]
                        </Link>
                      </li>
                      <li>
                        Mixed Migration Centre (2021). <span className="fst-italic">4Mi</span>.{' '}
                        <Link
                          className="font-sans fw-light"
                          href="https://mixedmigration.org/4mi/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [4mi resource]
                        </Link>
                      </li>

                      <li className="mt-3">
                        Earth Resources Observation and Science (EROS) Center. (2019).{' '}
                        <span className="fst-italic">Africa Land Cover</span>.{' '}
                        <Link
                          className="font-sans fw-light"
                          href="https://www.usgs.gov/media/images/africa-land-cover-characteristics-data-base-version-20"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [dataset]
                        </Link>
                      </li>
                      <li>
                        Esri. (2021). <span className="fst-italic">Africa Boundaries (ADM0)</span>.{' '}
                        <Link
                          className="font-sans fw-light"
                          href="https://hub.arcgis.com/datasets/geoduck::africa-boundaries/about"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [dataset]
                        </Link>
                      </li>
                      <li>
                        Esri. (2021). <span className="fst-italic">World Cities</span>.{' '}
                        <Link
                          className="font-sans fw-light"
                          href="https://hub.arcgis.com/datasets/esri::world-cities/about"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [dataset]
                        </Link>
                      </li>
                      <li>
                        Facebook Connectivity Lab and Center for International Earth Science
                        Information Network - CIESIN - Columbia University. 2016.{' '}
                        <span className="fst-italic">High Resolution Settlement Layer (HRSL)</span>.
                        Source imagery for HRSL © 2016 DigitalGlobe. Accessed 1 March 2023.
                      </li>
                      <li>
                        Global Modeling and Assimilation Office (GMAO). (2022),{' '}
                        <span className="fst-italic">
                          MERRA-2 statM_2d_edi_Nx: 2d, Single-Level, Monthly Extremes Detection
                          Indices based on 1991-2020 V2, Greenbelt, MD, USA, Goddard Earth Sciences
                          Data and Information Services Center (GES DISC)
                        </span>
                        , Accessed: 10 January 2022, 10.5067/O8AX56DO60MI.
                      </li>
                      <li>
                        Permanent Interstate Committee for Drought Control in the Sahel (CILSS),
                        Integrated Phase Classification (IPC). (2021).{' '}
                        <span className="fst-italic">
                          Cadre Harmonisé (CH) & Integrated Phase Classification (IPC) for West &
                          Central Africa
                        </span>
                        .{' '}
                        <Link
                          className="font-sans fw-light"
                          href="https://www.ipcinfo.org/ch/en/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [CH & IPC resource]
                        </Link>
                      </li>
                      <li>
                        Raleigh, C., Linke, A., Hegre, H. & Karlsen, J. (2010).{' '}
                        <span className="fst-italic">
                          Introducing ACLED-Armed Conflict Location and Event Data
                        </span>
                        . Journal of Peace Research 47(5), 651- 660.{' '}
                        <Link
                          className="font-sans fw-light"
                          href="https://acleddata.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [ACLED resource]
                        </Link>
                      </li>
                    </ul>
                  </AboutSection>
                  <AboutSection title={'Credits'} className="mb-5 pb-5">
                    <h6 className="mt-4">
                      <Link
                        href="https://civicdatadesignlab.mit.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Civic Data Design Lab at Massachusetts Institute of Technology
                      </Link>
                    </h6>
                    <p className="body-5 mb-2">
                      Data analysis, visualization, website design and development
                    </p>
                    <p className="body-5 mt-2">
                      Sarah Williams (Director), Ashley Louie (Project Lead), Enrique Casillas, John
                      Devine, Jonathan Goh, Sebastian Ives, Namhi Kwun, Thanh Nguyen, Jariyaporn
                      Prachasartta, Hannah Shumway, Alison Wang, Tony Xiao
                    </p>
                    <h6 className="mt-4">
                      <Link href="https://www.wfp.org/" target="_blank" rel="noopener noreferrer">
                        United Nations World Food Programme
                      </Link>
                    </h6>
                    <p className="body-5">
                      Sara Moussavi, Eleonora Corsale, Mark Wischmeyer, Federico Doehnert
                    </p>
                    <h6 className="mt-4">
                      <Link href="https://www.ifpri.org/" target="_blank" rel="noopener noreferrer">
                        International Food Policy Research Institute
                      </Link>
                    </h6>
                    <p className="body-5">Alan de Brauw, Eduardo Maruyama, Kate Ambler</p>
                    <h5 className="mt-5 mb-1">Acknowledgements</h5>
                    <p className="body-5">
                      Thanks to the{' '}
                      <Link
                        className="fw-bold"
                        href="https://www.iom.int/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        International Organization for Migration (IOM)
                      </Link>{' '}
                      and the{' '}
                      <Link
                        className="fw-bold"
                        href="https://mixedmigration.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mixed Migration Centre (MMC)
                      </Link>{' '}
                      for sharing datasets, which are included in visualizations on this website.
                    </p>
                  </AboutSection>
                  <Row className="mt-5 ps-3 pe-3 ps-sm-0 pe-sm-0">
                    <Col xs={5} lg={4} className="p-0">
                      <a
                        href="https://civicdatadesignlab.mit.edu/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="h-100 d-flex align-items-center"
                      >
                        <img
                          src="/images/logos/MIT_CDDL_cobrand-01.png"
                          alt="mit-cddl-logo"
                          className="w-100"
                        ></img>
                      </a>
                    </Col>
                    <Col xs={4} lg={{ span: 3, offset: 1 }} className="p-0">
                      <a
                        href="https://www.wfp.org/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="h-100 d-flex align-items-center"
                      >
                        <img
                          src="/images/logos/WFPnewlogo_english_standard_BLUE_RGB.png"
                          alt="wfp-logo"
                          className="w-100"
                        ></img>
                      </a>
                    </Col>
                    <Col xs={3} lg={{ span: 2, offset: 1 }} className="pe-0">
                      <a
                        href="https://www.ifpri.org/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="h-100 d-flex align-items-center"
                      >
                        <img
                          src="/images/logos/IFPRI_Logo_Horizontal.png"
                          alt="ifpri-logo"
                          className="w-100"
                        ></img>
                      </a>
                    </Col>
                  </Row>
                  <Row className="mt-3 ps-3 pe-3 ps-sm-0 pe-sm-0 pb-5 mb-5">
                    <Col xs={{ span: 3, offset: 3 }} lg={{ span: 2 }} className="p-1">
                      <a
                        href="https://www.iom.int/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="h-100 d-flex align-items-center"
                      >
                        <img
                          src="/images/logos/IOM_logo.png"
                          alt="iom-logo"
                          className="w-100"
                        ></img>
                      </a>
                    </Col>
                    <Col xs={{ span: 2, offset: 1 }} lg={{ offset: 2 }} className="p-1">
                      <a
                        href="https://mixedmigration.org/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="h-100 d-flex align-items-center"
                      >
                        <img
                          src="/images/logos/MMC_logo.png"
                          alt="mmc-logo"
                          className="w-100"
                        ></img>
                      </a>
                    </Col>
                  </Row>
                  {/* </div> */}
                </Col>
              ) : selected === 'journey' ? (
                <Col xs={12} sm={7} className="pt-md-5 mt-md-5 pb-5">
                  <JourneysMenu journeys={journeys} handleRouting={handleRouting} />
                </Col>
              ) : selected === 'map' ? (
                <Col xs={12} sm={7} className="pt-md-5 mt-md-5 pb-5">
                  <MapMenu handleRouting={handleRouting} />
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </Container>
        </animated.div>
      </div>
    </nav>
  );
}

function AboutSection({ title, body, children }) {
  return (
    <>
      <div className={`mt-md-5 ${styles.aboutSection}`}>
        <h3>{title}</h3>
        {children}
      </div>
    </>
  );
}

function JourneysMenu({ journeys, handleRouting }) {
  return (
    <ul className={styles.journeyContainer}>
      {journeys.slice(1).map((journey) => (
        <li key={journey.id} className={styles.journeyItem}>
          {/* <span className="material-symbols-outlined"> arrow_forward</span> */}
          <Link
            className={styles.routeJourney}
            key={journey.id}
            onClick={handleRouting('/journeys/' + journey.route)}
            href={'/journeys/' + journey.route}
          >
            {journey.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MapMenu({ handleRouting }) {
  return (
    <ul className={styles.journeyContainer}>
      <li className={styles.journeyItem}>
        <Link className={styles.routeJourney} onClick={handleRouting('/')} href="/">
          Place of Origin
        </Link>
      </li>
    </ul>
  );
}
