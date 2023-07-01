import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const BottomSheet = () => {
  const [sheetPosition, setSheetPosition] = useState<"top" | "bottom">(
    "bottom",
  );
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const topSnapPoint = 100;
  const bottomSnapPoint = 400;

  const getSheetHeight = () => {
    return window.innerHeight - topSnapPoint;
  };

  const clampY = (value: number, min: number, max: number) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const clampedY = useTransform(y, (value) =>
    clampY(value, topSnapPoint, bottomSnapPoint),
  );

  const snapTo = (point: "top" | "bottom") => {
    const snapPoint = point === "top" ? topSnapPoint : bottomSnapPoint;
    y.set(snapPoint);
    setSheetPosition(point);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const velocity = Math.abs(y.getVelocity());
    const currentPosition = y.get();

    if (velocity < 100) {
      if (currentPosition < (topSnapPoint + bottomSnapPoint) / 2) {
        snapTo("top");
      } else {
        snapTo("bottom");
      }
    } else {
      snapTo(currentPosition < bottomSnapPoint ? "top" : "bottom");
    }
  };

  const handleDrag = (event: any, info: any) => {
    if (sheetPosition === "top" && info.delta.y > 0) {
      return;
    }

    if (sheetPosition === "bottom" && info.delta.y < 0) {
      return;
    }

    y.set(info.point.y);
  };

  // 바텀시트 안에 스크롤 가능한 컴포넌트가 있다고 가정합니다.
  const handleScroll = (event: any) => {
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;
    const scrollTop = event.target.scrollTop;

    if (scrollTop === 0 && sheetPosition === "top") {
      // 바텀시트가 top이고 스크롤이 최상단에 도달했을 때
      y.set(topSnapPoint);
    } else if (
      scrollTop + clientHeight === scrollHeight &&
      sheetPosition === "bottom"
    ) {
      // 바텀시트가 bottom이고 스크롤이 최하단에 도달했을 때
      y.set(bottomSnapPoint);
    }
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        height: getSheetHeight(),
        background: "white",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
        overflowY: "scroll",
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      dragMomentum={false}
      dragPropagation={isDragging}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      animate={{ y: clampedY.get() }}
    >
      <div style={{ padding: "16px" }}>
        <h1>바텀시트</h1>
        <p>내용이 들어갑니다.</p>
        <div style={{ height: 1000 }} onScroll={handleScroll}>
          {/* 스크롤 가능한 컴포넌트 */}
        </div>
      </div>
    </motion.div>
  );
};

export default BottomSheet;
