"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

interface ButtonProps {
    isActive: boolean;
    setIsActive: (isActive: boolean) => void;
}

export default function Button({ isActive, setIsActive }: ButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        
    }, { scope: buttonRef, dependencies: [isActive] });
    return (
        <div onClick={() => { setIsActive(!isActive)}} className={styles.button} ref={buttonRef}>

        </div>
    )
}