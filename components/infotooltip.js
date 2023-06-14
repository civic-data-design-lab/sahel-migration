import styles from "../styles/InfoTooltip.module.css"
import { OverlayTrigger, Tooltip } from "react-bootstrap";

/** 
 * [bar description]
 * @param  {any} children child element that activates that Wrapper on hover
 * @param  {String} text text to be shown in the popup tooltip
 * @param  {String} placement Sets the direction the Tooltip is positioned towards
 * @param  {String} className className provided from parent component 
 * module.css file (controls) styling of wrapper
 * @return {any}     all styles to be shown on the map
*/
export default function InfoTooltipWrapper({ children, text, placement, className }) {
    // Put the element that activates the tooltip on hover inside of this wrapper element
    const tooltip = (
        <Tooltip className={styles.tooltip}>
            <strong>{text}</strong>
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement={placement}
            overlay={tooltip}
            data-icon="info"

        >
            <div
                className={className}
                style={{
                    display: "flex",
                    alignItems: "center"
                }}
            >
                {children}
                <span
                    className="material-symbols-outlined"
                    id={styles.icon}
                >
                    info
                </span>
            </div>
        </OverlayTrigger>


    )
}