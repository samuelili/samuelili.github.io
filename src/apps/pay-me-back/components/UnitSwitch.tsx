import styles from './UnitSwitch.module.css';
import type { ButtonHTMLAttributes } from 'react';


export type Unit = "dollar" | "percent";

export type UnitSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
    unit: Unit;
    onChange: (unit: Unit) => void;
}

const UnitSwitch = ({ unit, onChange, disabled, className, ...props }: UnitSwitchProps) => {

    const handleToggle = () => {
        if (disabled) return;
        onChange(unit === "dollar" ? "percent" : "dollar");
    }

    return (
        <button className={styles.Container + " " + className} role="group" onClick={handleToggle} data-unit={unit} {...props}>
            <div className={styles.Indicator} data-unit={unit} />
            <div className={styles.Option} data-selected={unit === "dollar"}>$$</div>
            <div className={styles.Option} data-selected={unit === "percent"}>%%</div>
        </button>
    );
}

export default UnitSwitch;