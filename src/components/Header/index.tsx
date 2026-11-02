"use client";

import styles from "./style.module.scss";
import Links from "./data";
import Button from "./Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function Header() {
    const [isActive, setIsActive] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    useGSAP(() => {

    }, { scope: headerRef, dependencies: [isActive] });

    return (
        <header className={styles.header} ref={headerRef}>
            <Button isActive={isActive} setIsActive={setIsActive} />
        </header>
    )
}