import styles from '../../styles/FloatButton.module.css';
import Image from 'next/image';
import Head from 'next/head';
export default function FloatButton({ type }) {
    const buttonType = {
        zoomIn: { icon: <span className="material-symbols-outlined">add</span> },
        zoomOut: { icon: <span className="material-symbols-outlined">remove</span> },
        seeMore: { icon: <span className="material-symbols-outlined">more_horiz</span> },
    };

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
                />
            </Head>
            <button className={styles.floatButton}>{buttonType[type].icon}</button>
        </>
    );
}

