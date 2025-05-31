import React, { useEffect, useRef, useState } from "react";
import styles from "./ItemLove.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const hearts = ["💖", "❤️", "💘", "💕", "🩷", "❤️‍🔥"];
const name = "Nguyễn Ngọc Phương Trinh";
const messages = [
    "nhớ cậu quá đi 🥹",
    "cậu ăn gì chưa 🤤",
    "cậu đang làm gì đó 🩵",
    "nhớ đi ngủ sớm nha 🥱",
];

function FallingHearts() {
    const containerRef = useRef(null);
    const [zIndexCounter, setZIndexCounter] = useState(1);

    const [items, setItems] = useState([]);
    const [stars, setStars] = useState([]);
    const audioRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;

            const rotateX = y * -30;
            const rotateY = x * 30;

            if (containerRef.current) {
                containerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        };

        const resetRotation = () => {
            if (containerRef.current) {
                containerRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", resetRotation);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", resetRotation);
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        const enableAudio = () => {
            audio.muted = false;
            audio.play().catch(() => {});
            document.removeEventListener("click", enableAudio);
        };

        // Một số trình duyệt sẽ chặn autoplay có âm thanh
        // Cần người dùng click để kích hoạt
        document.addEventListener("click", enableAudio);

        // Tự phát khi load (nếu trình duyệt cho phép)
        audio.play().catch(() => {
            // Nếu bị chặn, chờ user click như trên
        });

        return () => {
            document.removeEventListener("click", enableAudio);
        };
    }, []);

    useEffect(() => {
        // tạo sao lấp lánh
        const generatedStars = Array.from({ length: 40 }, () => ({
            id: Math.random(),
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: Math.random() * 4 + 2, // từ 2px đến 6px
            delay: Math.random() * 5, // animation delay
        }));
        setStars(generatedStars);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const left = Math.random() * 90;
            const heart = hearts[Math.floor(Math.random() * hearts.length)];
            const type = Math.random() < 0.5 ? "name" : "message";

            const content =
                type === "name"
                    ? `${name} ${heart}`
                    : messages[Math.floor(Math.random() * messages.length)];

            const newItem = {
                id: Date.now() + Math.random(),
                left,
                content,
                type,
                zIndex: zIndexCounter,
            };

            setZIndexCounter((prev) => prev + 1);

            setItems((prev) => [...prev, newItem]);

            setTimeout(() => {
                setItems((prev) =>
                    prev.filter((item) => item.id !== newItem.id)
                );
            }, 6000);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div ref={containerRef} className={cx("container")}>
            <audio
                ref={audioRef}
                src="/assets/music/iumatroi.mp3"
                autoPlay
                loop
                muted
            />

            {/* Các sao lấp lánh */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className={cx("star")}
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                    }}
                />
            ))}

            {items.map((item) => (
                <span
                    key={item.id}
                    className={cx("falling", item.type)}
                    style={{ left: `${item.left}%`, zIndex: item.zIndex }}
                >
                    {item.content}
                </span>
            ))}
        </div>
    );
}

export default FallingHearts;
