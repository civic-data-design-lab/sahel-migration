import Image from "next/image"
import { Col, Container, Stack, Row } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Map.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import Head from "next/head";
import FloatButton from "../../components/floatButton";

export default function MainMap() {

    const { width } = useWindowSize()
    return (
        <div className={styles.mapContainer} >
            <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
            }}>
                <Container fluid style={{ position: 'relative', padding: 'clamp(1rem, 1vw, 1.5rem)', margin: '0', zIndex: '3' }}>
                    <Stack gap={4}>
                        <Row>
                            <header>
                                <h5 style={{ fontSize: 'clamp(1rem, 1vw, 1.25rem' }}>West African Migration</h5>
                                {width > 600 && (
                                    <h6 style={{ fontSize: '.75rem' }}>Risks of Migration Along the Central Mediterranean Route</h6>
                                )}
                            </header>
                        </Row>
                        <Stack className={styles.textContainer}>
                            <Row >
                                <Col lg={4}>
                                    <Stack style={{ overflow: 'hidden' }}>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni debitis aliquam, eum quaerat consectetur modi esse iure totam? Autem perferendis sit vitae! Ipsam eaque, maxime quis corrupti iste ex illum.</p>
                                        <p>Tempore placeat ipsum enim. Perferendis aspernatur alias ipsum nisi. Quisquam, labore. Rem et aliquid itaque nihil aperiam, ut consequatur ea unde mollitia, ipsum perspiciatis ducimus blanditiis animi rerum culpa nesciunt?</p>
                                        <p>Repellat voluptatum accusamus quia illo odit nemo iure voluptates, rerum nobis deleniti sunt sequi neque consequatur a at asperiores possimus perferendis, voluptate labore est! Consequatur porro delectus quisquam quidem eaque.</p>
                                    </Stack>
                                </Col>
                                {width > 1000 && (
                                    <Col>
                                    </Col>
                                )}
                            </Row>
                            <Row style={{
                                left: '0',
                                bottom: '0'
                            }}>
                                <h6>Select a <span style={{ color: '#D66937', fontStyle: 'italic' }}>Route</span> To Explore</h6>
                            </Row>
                        </Stack>
                    </Stack>
                </Container>
                <div className={styles.map} >
                    <img style={{
                        objectFit: 'cover',
                        width: '100%'
                    }} src='/images/WestAfricaMain.png' />
                </div>
                <Stack style={{ position: 'fixed', right: '2rem', bottom: '2rem' }} gap='1'>
                    <FloatButton type='zoomIn' />
                    <FloatButton type='zoomOut' />
                </Stack>
            </div>
        </div >
    )
}
