import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'


export default function RouteTip({ regionData }) {
    const vignetteNames = ["Beginning the Journey", "Passing Through Agadez", "Crossing the Sahara Desert", "Entering Libya", "Passing Through Sabha", "Reaching Tripoli", "Current Conditions in Libya"]
    const round = (num: number) => Math.round(num)





    return (
        (regionData && (

            <div className={styles.tooltip}>
                <div className={styles.city}>
                    <h5 className={styles.vignetteName}>{vignetteNames[regionData.routeId - 1]}</h5>
                    <div
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #A3A3A3',
                            marginBottom: '0.5rem'

                        }}
                    ></div>

                    <div style={{
                        display: 'flex',
                        gap: '0rem',
                        flexDirection: 'column'
                    }}>
                        <InfoBox
                            left={`Migration Risk`}
                            text={round(regionData.totalRisk)}
                            region={""}
                            small={false}
                            bold={true}
                            squeeze={false}
                            align={'space-between'}
                        />

                        {regionData.risks.map((risk) => {
                            let stat = risk && risk.riskLevel
                            const name = risk && risk.name
                            if (name === "Reported Violence") {
                                stat = round(regionData.totalRisk - regionData.risks.
                                    filter((r) => r.name !== "Reported Violence").
                                    map((r) => r.riskLevel).
                                    reduce((a, b) => a + b, 0))
                            }
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
        )
        ))

}

function InfoBox({ left, text, region, small, bold, align, squeeze }) {
    return (
        <div
            className={styles.infoBox}
            style={{

                ['--alignment' as any]: align || 'flex-start',
                ['--paddingFactor' as any]: squeeze ? '1rem' : '0rem'
            }}>
            {left &&
                (<h4
                    style={{
                        ['--weight' as any]: bold ? '600' : 'initial',
                        fontSize: small ? "0.75rem" : "1rem"
                    }}
                >{left}</h4>)}
            <p
                style={{
                    fontSize: small ? "0.75rem" : "1rem",
                    fontWeight: bold ? '600' : 'initial',
                }}
            >{text} <span style={{ fontWeight: '600' }}>{region}</span> </p>
        </div>
    )
}

