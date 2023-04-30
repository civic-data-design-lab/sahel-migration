import { motion } from "framer-motion";
import styles from "../styles/Card.module.css";


export default function RiskItems({ isOpen }) {
  const transectRisks = [
    "Migration Risks",
    "Proximity to Urban Areas",
    "Reported Violence",
    "Conlfict Areas",
    "Food Prices",
    "Photos"
  ]

  return (
    <>
      {transectRisks.map((risk) => {
        <div key={risk}>risk</div>
      })}
    </>)
}
