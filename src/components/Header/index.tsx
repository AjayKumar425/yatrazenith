"use client";

import styles from "./style.module.scss";
import Links from "./data";
import Button from "./Button";

export default function Header() {
    const [isActive, setIsActive] = useState(false);

    return (
        <header className={styles.header}>
            <Button isActive={isActive} setIsActive={setIsActive} />
        </header>
    )
}