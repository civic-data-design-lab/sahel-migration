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

  const toggleTab = () => {

  }

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
            <span className="material-symbols-outlined" style={{ color: '#463c35', fontSize: '2rem' }}>
              menu
            </span>
          </button>
        ) : (
          <button onClick={handleToggle} className={styles.menuButton}>
            <span className="material-symbols-outlined" style={{ color: '#463c35', fontSize: '2rem' }}>
              close
            </span>
          </button>
        )}
      </span>
      <div>
        {/* <animated.div style={fullScreenFill} className={styles.screenCover} /> */}
        <animated.div style={fullscreenMenu} className={styles.navBar}>
          <Title className={styles.title} />
          <Container fluid className={`w-100 h-100 pt-5 pb-1 ${styles.container}`}>
            <Row className="h-100 mt-4">

              <Col xs="4" className="h-100 d-flex align-items-center mb-5 pb-5">
                <div className="position-fixed mb-5 pb-5 stickyContainer">
                  <ul className={styles.listContainer}>
                    <li><span className={styles.routeAbout}>About</span></li>
                    <li>
                      <Link className={styles.route} onClick={handleRouting('/')} href="/">
                        Map
                      </Link>
                    </li>
                    <li>
                      <span className={styles.route} onClick={toggleTab}>Journey</span>
                      <ul className={styles.journeyContainer}>
                        {journeys.map((journey) => (
                          <li key={journey.id} className={styles.journeyItem}>
                            {/* <span className="material-symbols-outlined"> arrow_forward</span> */}
                            <Link
                              className={styles.routeJourney}
                              key={journey.id}
                              onClick={handleRouting('/journeys/' + journey.id)}
                              href={'/journeys/' + journey.id}
                            >
                              {journey.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </div>
              </Col>

              <Col xs="7" className="mt-5 pt-5">
                <AboutSection title={'Risks of West African Migration'}>
                  <p className="body-5">Thousands of migrants risk their lives each year to travel from West Africa to Libya through a heavily traversed pathway, known as the Central Mediterranean Route. Of the estimated 621,000 immigrants in Libya in 2022, over 40% have origins in West Africa (IOM, 2022). In June and July 2021, migrants in Libya were surveyed by the United Nations World Food Programme (WFP) and the International Food Policy Research Institute (IFPRI) with questions pertaining to their place of origin, their journey to Libya, their intentions to move on, and their current economic conditions and food security status. The resulting survey sample consisted of 347 migrants from Economic Community of West African States (ECOWAS) countries in Tripoli and Sabha, with the most from Niger*, Chad, Nigeria, Mali, and Ghana. Migrants on the Move visualizes the combined risks of migrants traveling from West Africa to Libya, along the Central Mediterranean route.</p>
                  <p className="body-5">Migrants traveling in North Africa face significant risks, often resorting to illicit means of traveling with smugglers crossing through treacherous terrain in remote areas. A variety of factors contribute to increased risk during migration, including food insecurity, lack of access to resources, heat exposure, and physical violence and abuses. In an attempt to enter Libya undetected, many migrants cross through the Tenere, a stretch within the Sahara Desert that spans hundreds of kilometers. Many migrants turn to smugglers in order to receive protection and navigation assistance during stretches of the journey, but hiring a smuggler often comes at a high cost and can also leave migrants vulnerable to bribery and extortion. Regardless of their travel means, migrants are at great risk while in transit along the Central Mediterranean route.</p>
                  <p className="body-5">Documenting and analyzing the risks of irregular migration is crucial to better addressing the needs of migrants.  The routes of migrants originating from West Africa traveling to Libya were mapped using data provided by the International Organization for Migration (IOM). In parallel to the World Food Programme case studies that dive deeper into irregular migration in Libya and in Mali, the data visualizations shown in Migrants on the Move focus on one route from Bamako, Mali to Tripoli, Libya.</p>
                </AboutSection>
                <AboutSection title={'Policy Recommendations'}>
                  <ol>
                    <li className='body-5'>Since the main push factor for migrants to leave their countries of origin is economic wage differentials, WFP should focus efforts on building economic opportunities at the country of origin. Such efforts could include employment generation programmes in partnership with national governments, training opportunities in the technology sector, or engagement in rural food systems programmes.</li>
                    <li className='body-5'>Given the extremely high levels of risk during transit, including those related to protection and food insecurity, WFP should work more closely with key partners in the provision of needs-based assistance to migrants.</li>
                    <li className='body-5'>In locations where migrants settle or use as protracted transit sites, WFP and partners should address food insecurity and other humanitarian requirements through existing social protection systems, also considering the needs of the host population to avoid potential tensions.</li>
                  </ol>
                </AboutSection>
                <AboutSection title={'Related Reports'}>
                  <ul>
                    <li className="body-5">Addressing Irregular Migration through Principled Programmatic Approaches: Examining the West Africa Route and WFP Operations <Link href="#">[Download the report]</Link></li>
                    <li className="body-5">Irregular Migration in Libya <Link href="#">[Download the report]</Link></li>
                    <li className="body-5">Irregular Migration in Mali <Link href="#">[Download the report]</Link></li>
                  </ul>
                </AboutSection>
                <AboutSection title={'Methodology'}>
                  <h5>Migration Routes</h5>
                  <p className="body-5">Migration routes from West Africa using two datasets: IFPRI survey of irregular migrants in Libya 2021 and the IOM flow monitoring surveys with XX,000 responses collected between July 2020 &ndash; June 2022. Origin and destination locations were processed with an Open Street Maps script to produce individual routes for migrants originating in various locations in West Africa, traveling to Tripoli, Libya.</p>
                  <ul>
                    <li>
                      <h6>Route Traffic</h6>
                      <p className="body-5">Sum of IOM survey routes within 20km of transect. (Some areas stitched together to account for gaps caused by the routing engine) “Score” field translates these counts to a score between 0 and 100</p>
                    </li>
                  </ul>
                  <h5>Migration Risk</h5>
                  <p className="body-5">Migrant risk analysis involved analysis of six layers: reported violence, armed conflict, food insecurity, the need for a smuggler, remoteness, and heat exposure.</p>
                  <ul>
                    <li>
                      <h6>Reported Violence</h6>
                      <p className="body-5">4Mi data on reported violence and abuses, collected by the Mixed Migration Centre. Sum of citation count by category within 50km radius of each vertex on the transect in 2021. Risk layer rescales these counts to a 0-100 scale for the transect.</p>
                    </li>
                    <li>
                      <h6>Armed Conflict</h6>
                      <p className="body-5">Armed Conflict Location Evnt Data. Sum incident count by category within 50km radius of each vertex on the transect in 2022. Risk layer rescales these counts to a 0-100 scale for the transect</p>
                    </li>
                    <li>
                      <h6>Food Insecurity</h6>
                      <p className="body-5">Cadre Harmonise IPC food secuirty data</p>
                    </li>
                    <li>
                      <h6>Need for a Smuggler</h6>
                      <p className="body-5">100: Northeast Niger within 50km of a border; 75: Northeast Niger more than 50km from a border; 50: Libya, Tunisia, Morocco, Algeria within 50km of a border;25: Libya, Tunisia, Morocco, Algeria more than 50km from a border</p>
                    </li>
                    <li>
                      <h6>Remoteness</h6>
                      <p className="body-5">Distance from nearest city in 30-minute increments. No point if not within 150 minutes of a city. Risk score of 100 if outside the 150 minute drive time, 80 if in the 120-150 minute range, 60 in the 90-120 minute range, etc.</p>
                    </li>
                    <li>
                      <h6>Heat Exposure</h6>
                      <p className="body-5">Average of daily maximium temperatures in 2022, measured in kelvin sampled at each point in areas with barren land cover.</p>
                    </li>
                  </ul>
                </AboutSection>
                <AboutSection title={'Data Sources'}>
                  <ul>
                    <li className="body-5">International Food Policy Research Institute. (2021). Survey of Irregular Migrants in Libya 2021 [IFPRI].</li>
                    <li className="body-5">International Organization for Migration. (July 2020 - June 2022). Displacement Tracking Matrix (DTM) [DTM datasets].</li>
                    <li className="body-5">Mixed Migration Centre (2021). 4Mi [4mi resource].</li>
                    <li className='body-5'>Permanent Interstate Committee for Drought Control in the Sahel (CILSS), Integrated Phase Classification. (2021). Cadre Harmonisé (CH) & Integrated Phase Classification (IPC) for West & Central Africa. [CH & IPC resource]</li>
                    <li className='body-5'>Esri. (2021). Africa Boundaries (ADM0). [dataset]</li>
                    <li className='body-5'>Facebook. Population</li>
                    <li className='body-5'>Global Modeling and Assimilation Office (GMAO). (2022), MERRA-2 statM_2d_edi_Nx: 2d, Single-Level, Monthly Extremes Detection Indices based on 1991-2020 V2, Greenbelt, MD, USA, Goddard Earth Sciences Data and Information Services Center (GES DISC), Accessed: 10 January 2022, 10.5067/O8AX56DO60MI</li>
                    <li className='body-5'>Raleigh, C., Linke, A., Hegre, H. & Karlsen, J. (2010). Introducing ACLED-Armed Conflict Location and Event Data. Journal of Peace Research 47(5), 651- 660. [ACLED resource].</li>
                  </ul>
                </AboutSection>
                <AboutSection title={'Credits'} className='mb-5 pb-5'>
                  <h5>Civic Data Design Lab at Massachusetts Institute of Technology</h5>
                  <p className='body-5'>Data analysis, visualization, website design and development<br />
                    Sarah Williams (Director), Ashley Louie (Project Manager), Enrique Casillas, John Devine, Jonathan Goh, Sebastian Ives, Namhi Kwun, Thanh Nguyen, Jariyaporn Prachasartta, Hannah Shumway, Alison Wang, Tony Xiao</p>
                  <h5>United Nations World Food Programme</h5>
                  <p className='body-5'>Sara Moussavi, Eleonora Corsale, Mark Wischmeyer, Federico Doehnert</p>
                  <h5>International Food Policy Research Institute</h5>
                  <p className='body-5'>Alan de Brauw, Eduardo Maruyama, Kate Ambler</p>
                  <h5>Acknowledgements</h5>
                  <p className='body-5'>Thanks to the International Organization for Migration (IOM) and the Mixed Migration Centre (MMC) for sharing datasets, which are included in visualizations on this website.</p>
                </AboutSection>




                <div className={styles.logoContainerLg}>
                  <img src='/images/logos/MIT_CDDL_cobrand-01.png' alt='mit-cddl-logo'></img>
                  <img src='/images/logos/WFPnewlogo_english_standard_BLUE_RGB.png' alt='wfp-logo'></img>
                  <img src='/images/logos/IFPRI_Logo_Horizontal.png' alt='ifpri-logo'></img>
                </div>

                <div className={styles.logoContainerSm}>
                  <img src='/images/logos/MMC_logo.png' alt='mmc-logo'></img>
                  <img src='/images/logos/IOM_logo.png' alt='iom-logo'></img>
                </div>
                


              </Col>

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
      <div className={`mt-5 ${styles.aboutSection}`}>
        <h3>{title}</h3>
        {children}
      </div>
    </>
  );
}
