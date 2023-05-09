import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'


export default function Routetip({ hoverInfo }) {
    const vignetteNames = ["Beginning the Journey", "Passing Through Agadez", "Crossing the Sahara Desert", "Entering Libya", "Passing Through Sabha", "Reaching Tripoli", "Current Conditions in Libya"]
    const round = (num: number) => Math.round(num)

    console.log(hoverInfo)



    return (
        <Popup style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column-reverse',
        }}
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[0, 175]}
            anchor="center"
            closeButton={false}
            className="county-info"
        >
            <div className={styles.tooltip}>
                <div className={styles.city}>
                    <h5 className={styles.subtitle}>{vignetteNames[hoverInfo.routeId - 1]}</h5>
                    <div
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #A3A3A3',

                        }}
                    ></div>

                    <div style={{
                        display: 'flex',
                        gap: '0.2rem',
                        flexDirection: 'column'
                    }}>
                        <InfoBox
                            left={`Migration Risk`}
                            text={round(hoverInfo.totalRisk)}
                            region={""}
                            small={false}
                            bold={true}
                            squeeze={false}
                            align={'space-between'}
                        />

                        {hoverInfo.risks.map((risk) => {
                            const stat = risk && risk.riskLevel
                            const name = risk && risk.name
                            return (
                                <InfoBox
                                    key={risk.name}
                                    left={name}
                                    text={round(stat)}
                                    region={''}
                                    align={'space-between'}
                                    small={true}
                                    squeeze={false}
                                    bold={false}
                                />
                            )
                        })}

                    </div>
                </div>
            </div >
        </Popup>
    )
}

function InfoBox({ left, text, region, small, bold, align, squeeze }) {
    return (
        <div
            className={styles.infoBox}
            style={{

                ['--alignment' as any]: align || 'flex-start',
                ['--paddingFactor' as any]: squeeze ? '1rem' : '0.5rem'
            }}>
            {left &&
                (<h4
                    style={{
                        ['--weight' as any]: bold ? '620' : 'initial',
                        fontSize: small ? "1rem" : "1.5rem"
                    }}
                >{left}</h4>)}
            <p
                style={{
                    fontSize: small ? "1rem" : "1.5rem",
                    fontWeight: bold ? '620' : 'initial',
                }}
            >{text} <span style={{ fontWeight: '620' }}>{region}</span> </p>
        </div>
    )
}

