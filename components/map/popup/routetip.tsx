import styles from './../../../styles/Tooltip.module.css'
import { useContext } from 'react'
import { SectionContext } from './../../../pages/index'

export default function RouteTip({ regionData }) {
    const vignetteNames = ["Beginning the Journey", "Passing through Agadez", "Crossing the Sahara Desert", "Entering Libya", "Passing through Sabha", "Reaching Tripoli", "Current Conditions in Libya"]
    const round = (num: number) => Math.round(num)
    const { currentSection, setSection } = useContext(SectionContext)

    return (

        (currentSection && currentSection.index) && (
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
                            text={round(regionData.totalRisk * 1/6)}
                            region={""}
                            small={false}
                            bold={true}
                            squeeze={false}
                            align={'space-between'}
                        />

                        {regionData.risks.map((risk) => {
                            let stat = risk && risk.riskLevel
                            const name = risk && risk.name
                            return (
                                <InfoBox
                                    key={risk.name}
                                    left={name}
                                    text={round(stat * 1/6)}
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
    )

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
                    marginBottom: '0.5rem',
                }}
            >{text} <span style={{ fontWeight: '600' }}>{region}</span> </p>
        </div>
    )
}

