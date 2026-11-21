"use client";

import React, { useRef, ReactNode, HTMLAttributes } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/ui/Magnetic/index";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP);

interface RoundedButtonProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    backgroundColor?: string;
}

export default function RoundedButton({
                                          children,
                                          backgroundColor = "#151515",
                                          className,
                                          style,
                                          onMouseEnter,
                                          onMouseLeave,
                                          ...attributes
                                      }: RoundedButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const activeTweenRef = useRef<gsap.core.Tween | null>(null);
    const leaveDelayRef = useRef<gsap.core.Tween | null>(null);

    useGSAP(
        () => {
            if (!circleRef.current) return;

            const tl = gsap.timeline({ paused: true });
            tl.to(
                circleRef.current,
                { yPercent: -83.33, scaleX: 1.5, duration: 0.4, ease: "power3.in" },
                "enter"
            ).to(
                circleRef.current,
                { yPercent: -166.67, scaleX: 1.25, duration: 0.25 },
                "exit"
            );

            timelineRef.current = tl;

            return () => {
                leaveDelayRef.current?.kill();
                activeTweenRef.current?.kill();
            };
        },
        { scope: buttonRef }
    );

    const manageMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        onMouseEnter?.(e);
        leaveDelayRef.current?.kill();
        activeTweenRef.current?.kill();

        if (timelineRef.current) {
            activeTweenRef.current = timelineRef.current.tweenFromTo("enter", "exit");
        }
    };

    const manageMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        onMouseLeave?.(e);
        leaveDelayRef.current?.kill();

        leaveDelayRef.current = gsap.delayedCall(0.3, () => {
            activeTweenRef.current?.kill();
            timelineRef.current?.play();
        });
    };

    return (
        <Magnetic>
            <div
                ref={buttonRef}
                className={
                    className
                        ? `${styles.roundedButton} ${className}`
                        : styles.roundedButton
                }
                style={style}
                onMouseEnter={manageMouseEnter}
                onMouseLeave={manageMouseLeave}
                {...attributes}
            >
                {children}
                <div
                    ref={circleRef}
                    style={{ backgroundColor }}
                    className={styles.circle}
                    aria-hidden="true"
                />
            </div>
        </Magnetic>
    );
}