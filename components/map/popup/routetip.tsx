import styles from './../../../styles/Tooltip.module.css'
import { useContext } from 'react'
import { SectionContext } from './../../../pages/index'

export default function RouteTip({ regionData }) {
    const vignetteNames = ["Beginning the Journey", "Passing through Agadez", "Crossing the Sahara Desert", "Entering Libya", "Passing through Sabha", "Reaching Tripoli", "Current Conditions in Libya"]
    const round = (num: number) => Math.round(num)
    const { currentSection, setSection } = useContext(SectionContext)
    let riskLevelBreaks = [8, 13, 21, 36, 47, 55];
    let combinedRiskValue = round(regionData.riskLevelData.totalRisk * 1 / 6)
    let riskLevel = (combinedRiskValue <= riskLevelBreaks[0]) ? 1
        : (riskLevelBreaks[0] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[1]) ? 2
            : (riskLevelBreaks[1] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[2]) ? 3
                : (riskLevelBreaks[2] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[3]) ? 4
                    : (riskLevelBreaks[3] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[4]) ? 5
                        : (riskLevelBreaks[4] < combinedRiskValue) ? 6
                            : null;
    let riskText = (combinedRiskValue < riskLevelBreaks[0]) ? "Low"
        : (riskLevelBreaks[0] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[1]) ? "Mid-Low"
            : (riskLevelBreaks[1] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[2]) ? "Mid"
                : (riskLevelBreaks[2] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[3]) ? "Mid-High"
                    : (riskLevelBreaks[3] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[4]) ? "High"
                        : (riskLevelBreaks[4] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[5]) ? "Very High"
                            : "";
    return (

        (currentSection && currentSection.index) && (
            <div className={styles.tooltip}>
                <div className={styles.city}>
                    <div style={{
                        display: 'flex',
                        gap: '0rem',
                        flexDirection: 'column'
                    }}>
                        <InfoBox
                            left={`Migration Risk`}
                            text={riskText}
                            region={""}
                            fontSize='1rem'
                            fontWeight={600}
                            squeeze={false}
                            align={'space-between'}
                            className={`${styles.riskTitle} ${styles[`risk-class-${riskLevel}`]}`}
                        />
                        <div style={{
                            display: 'flex',
                            gap: '0rem',
                            flexDirection: 'column',
                            padding: '0.4rem  0 0.3rem 0'
                        }}>
                            {regionData.riskLevelData.risks.map((risk) => {
                                let stat = risk && risk.riskLevel
                                const name = risk && risk.name
                                return (
                                    <InfoBox
                                        key={risk.name}
                                        left={name}
                                        text={round(stat * 1 / 6)}
                                        region=''
                                        align={'space-between'}
                                        fontSize='0.8rem'
                                        squeeze={false}
                                        fontWeight='initial'
                                        className={styles.route}
                                    />
                                )
                            })}
                        </div>
                        <div
                            className={styles["combinedRisk-Title"]}
                            style={{
                                paddingBottom: '0.5rem'
                            }}

                        >
                            <InfoBox
                                left={"Total Migration Risk"}
                                text={combinedRiskValue}
                                region={''}
                                align={'space-between'}
                                fontSize='0.82rem'
                                squeeze={false}
                                fontWeight={700}
                                className={styles.route}
                            />
                        </div>

                    </div>
                </div>
            </div >
        )
    )

}

function InfoBox({ left, text, region, fontSize, fontWeight, align, squeeze, className }) {
    return (
        <div
            className={`${styles.infoBox} ${className}`}
            style={{

                ['--alignment' as any]: align || 'flex-start',
                ['--paddingFactor' as any]: squeeze ? '1rem' : '0rem'
            }}>
            {left &&
                (<h4
                    style={{
                        ['--weight' as any]: fontWeight,
                        fontSize: fontSize,
                    }}
                >{left}</h4>)}
            <div></div>
            <p
                style={{
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    marginBottom: '0.5rem',
                }}
            >{text} <span style={{ fontWeight: '600' }}>{region}</span> </p>
        </div>
    )
}

