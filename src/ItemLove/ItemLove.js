import React, { useEffect, useRef, useState } from "react";
import styles from "./ItemLove.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const messages = [
    "I love you so much 🫶",
    "Anh yêu em ❤️",
    "Em bé xinh đẹp 🥰",
    "Tình yêu to bự 🥰",
];

// Danh sách ảnh
const images = [
    "/assets/imgs/avt1.jpg",
    "/assets/imgs/avt2.jpg",
    "/assets/imgs/avt3.jpg",
    "/assets/imgs/avt4.jpg",
    "/assets/imgs/avt5.jpg",
    "/assets/imgs/avt6.jpg",
    "/assets/imgs/avt7.jpg",
    "/assets/imgs/avt8.jpg",
    "/assets/imgs/avt9.jpg",
    "/assets/imgs/avt10.jpg",
    "/assets/imgs/avt11.jpg",
    "/assets/imgs/avt12.jpg",
];

function FallingHearts() {
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const [zIndexCounter, setZIndexCounter] = useState(1);
    const [items, setItems] = useState([]);
    const [stars, setStars] = useState([]);

    // Hiệu ứng xoay theo chuột
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;
            const rotateX = y * 30;
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

    // Phát nhạc nền
    useEffect(() => {
        const audio = audioRef.current;

        const enableAudio = () => {
            audio.muted = false;
            audio.play().catch(() => {});
            document.removeEventListener("click", enableAudio);
        };

        document.addEventListener("click", enableAudio);
        audio.play().catch(() => {});
        return () => {
            document.removeEventListener("click", enableAudio);
        };
    }, []);

    // Tạo sao lấp lánh
    useEffect(() => {
        const generatedStars = Array.from({ length: 40 }, () => ({
            id: Math.random(),
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 5,
        }));
        setStars(generatedStars);
    }, []);

    // Tạo hiệu ứng rơi chữ (tên hoặc message)
    useEffect(() => {
        const interval = setInterval(() => {
            const left = Math.random() * 90;

            const content =
                messages[Math.floor(Math.random() * messages.length)];

            const newItem = {
                id: Date.now() + Math.random(),
                left,
                content,
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

    // Tạo hiệu ứng rơi ảnh random (mỗi lần chỉ rơi 1 ảnh)
    useEffect(() => {
        let timeoutId;

        const createRandomImageFall = () => {
            const image = images[Math.floor(Math.random() * images.length)];

            const newImageItem = {
                id: Date.now() + Math.random(),
                left: Math.random() * 90,
                content: image,
                type: "image",
                zIndex: zIndexCounter,
            };

            setZIndexCounter((prev) => prev + 1);
            setItems((prev) => [...prev, newImageItem]);

            // Xóa ảnh sau 6 giây
            setTimeout(() => {
                setItems((prev) =>
                    prev.filter((i) => i.id !== newImageItem.id)
                );
            }, 6000);

            // Gọi tiếp rơi ảnh với độ trễ ngẫu nhiên
            const randomDelay = Math.random() * 3000 + 1000;
            timeoutId = setTimeout(createRandomImageFall, randomDelay);
        };

        createRandomImageFall();

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div ref={containerRef} className={cx("container")}>
            <audio
                ref={audioRef}
                src="/assets/music/emchimong.mp3"
                autoPlay
                loop
                muted
            />

            {/* Sao lấp lánh */}
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

            {/* Hiệu ứng rơi chữ và ảnh */}
            {items.map((item) => (
                <span
                    key={item.id}
                    className={cx("falling", item.type)}
                    style={{ left: `${item.left}%`, zIndex: item.zIndex }}
                >
                    {item.type === "image" ? (
                        <img
                            src={item.content}
                            alt="falling-img"
                            className={cx("falling-image")}
                        />
                    ) : (
                        item.content
                    )}
                </span>
            ))}
        </div>
    );
}

export default FallingHearts;
