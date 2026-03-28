import { useEffect, useRef } from "react";
import "./CursorFollower.css";

export default function CursorFollower() {
    const dotRef = useRef(null);
    const pos = useRef({ x: -100, y: -100 });
    const smooth = useRef({ x: -100, y: -100 });
    const raf = useRef(null);

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        const tick = () => {
            smooth.current.x += (pos.current.x - smooth.current.x) * 0.15;
            smooth.current.y += (pos.current.y - smooth.current.y) * 0.15;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${smooth.current.x}px, ${smooth.current.y}px) translate(-50%, -50%)`;
            }
            raf.current = requestAnimationFrame(tick);
        };

        document.addEventListener("mousemove", onMove);
        raf.current = requestAnimationFrame(tick);

        return () => {
            document.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
