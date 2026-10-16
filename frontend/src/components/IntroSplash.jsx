import { useEffect, useState } from "react";
import "./IntroSplash.css";

function IntroSplash() {
    const [isLeaving, setIsLeaving] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const leaveDelay = prefersReducedMotion ? 40 : 2300;
        const exitDuration = prefersReducedMotion ? 40 : 500;

        const leaveTimer = window.setTimeout(() => {
            setIsLeaving(true);
        }, leaveDelay);
        const removeTimer = window.setTimeout(() => {
            setIsVisible(false);
        }, leaveDelay + exitDuration);

        return () => {
            window.clearTimeout(leaveTimer);
            window.clearTimeout(removeTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`intro-splash${isLeaving ? " intro-splash--leaving" : ""}`}
            role="status"
            aria-label="Maqnet Kreasindo"
            aria-live="polite"
        >
            <div className="intro-splash__logo-wrap" aria-hidden="true">
                <img
                    className="intro-splash__logo"
                    src="/maqnet-kreasindo-transparent.png"
                    alt=""
                />
            </div>
            <span className="intro-splash__progress" aria-hidden="true" />
        </div>
    );
}

export default IntroSplash;
