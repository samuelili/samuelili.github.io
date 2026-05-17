import { forwardRef } from "react";
import { CalculatedOutput } from "./payMeBackMath"
import styles from "./PayMeBackScreenshot.module.css";

import smileSvg from "../assets/smile.svg";

const PayMeBackScreenshot = forwardRef<HTMLDivElement, { calculatedOutput: CalculatedOutput }>(({ calculatedOutput }, ref) => {
    return (
        <div className={styles.RootContainer} ref={ref}>
            <div className={styles.Container}>

                <div className="flex">
                    <p className="font-bold flex-1">Subtotal</p>
                    <p className="total-price">${calculatedOutput.subtotal.toFixed(2)}</p>
                </div>


                <div className="mt-3">
                    {Object.entries(calculatedOutput.perParticipant).map(([name, amount]) => (
                        <div className="flex">
                            <p className="font-bold flex-1 total-name">{name}</p>
                            <p className="total-price">${amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-3 flex">
                    <p className="font-bold flex-1">Total</p>
                    <p className="total-price">${calculatedOutput.total.toFixed(2)}</p>
                </div>

                <div className="mt-6 flex text-sm items-center">
                    <p>Split with </p>
                    <h3 className={styles.Title}>Pay Me Back</h3>
                    <img src={smileSvg} width={32} className="ml-2 mt-3" style={{ width: 32 }} />
                </div>
                <a className={styles.Link}>samuelili.github.io/pay-me-back</a>
            </div>
        </div>
    )
})

export default PayMeBackScreenshot