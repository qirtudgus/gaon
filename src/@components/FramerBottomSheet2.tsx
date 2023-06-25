import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";
import { PanInfo, motion, useAnimation, useScroll } from "framer-motion";
import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  WheelEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useScrollLock } from "src/hooks/useScrollLock";
import { createPortal } from "react-dom";

//! 자식요소에 스크롤이 없으면 정상작동하지않음

interface FramerBottomSheetProps extends PropsWithChildren {
  snapPoint: number[];
  initialPostion: "top" | "bottom";
}

const FramerBottomSheet2: FC<FramerBottomSheetProps> = ({
  snapPoint,
  initialPostion,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousScrollYPosition = useRef(0);

  const [isDrag, setIsDrag] = useState(initialPostion === "top" ? true : false);
  const [position, setPosition] = useState(initialPostion);
  const controls = useAnimation();

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y > 5 && info.point.y > 45);
    if (shouldClose) {
      console.log("닫기");
      setPosition("bottom");
    } else {
      console.log("열기");
      setPosition("top");
    }
    const scrollPosition = scrollRef.current!.scrollTop;
    const isScrollTop = scrollPosition === 0;
    if (isScrollTop) {
      setIsDrag(true);
    }
  };

  useEffect(() => {
    controls.start(position);
  }, [position]);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0] || !e.changedTouches[0]) return;
    // setTouch((prev) => prev + 1);
    // 자식요소의 스크롤 위치 === 0이면 맨 위인것
    const scrollPosition = scrollRef.current!.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      scrollRef.current!.scrollHeight - scrollRef.current!.offsetHeight;
    // 자식요소가 맨 아래일 때
    const isScrollBottom = scrollHeight === scrollPosition;
    const touchStartY = e.touches[0].clientY;
    const touchEndY = e.changedTouches[0].clientY;

    if (touchEndY > touchStartY) {
      console.log("You slid down");
      if (isScrollTop) {
        setIsDrag(true);
      }
    } else {
      console.log("You slid up");
      if (isScrollBottom) {
      }
    }
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollYPosition = e.currentTarget.scrollTop;
    // 자식요소의 스크롤 위치 === 0이면 맨 위인것
    const scrollPosition = scrollRef.current!.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      scrollRef.current!.scrollHeight - scrollRef.current!.offsetHeight;
    // 자식요소가 맨 아래일 때
    const isScrollBottom = scrollHeight === scrollPosition;

    //스크롤 있는지 여부
    const hasScroll =
      scrollRef.current!.scrollHeight > scrollRef.current!.clientHeight;

    // 스크롤 방향 판별
    if (currentScrollYPosition > previousScrollYPosition.current) {
      console.log("You are scrolling down");
      //! 내리는중
      //! 내리는중인데 스크롤이 존재한다면 요소 잠금
      if (hasScroll) {
        setIsDrag(false);
      }
      if (isScrollTop) {
        setIsDrag(true);
      }
    } else {
      // ! 올리는 중
      if (isScrollTop) {
        setIsDrag(true);
      }
      console.log("You are scrolling up");
    }

    // 현재 스크롤 위치를 기록
    previousScrollYPosition.current = currentScrollYPosition;
  };

  return (
    <>
      {createPortal(
        <motion.div
          className="rounded-t-3xl h-[50vh] w-full overflow-hidden bg-red-200 fixed bottom-0 left-0 "
          onDragEnd={onDragEnd}
          ref={containerRef}
          initial={position}
          animate={controls}
          drag={isDrag ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          variants={{
            top: { bottom: 0 },
            bottom: { bottom: "-30vh" },
          }}
          transition={{
            type: "just",
          }}
        >
          <div
            data-scroll-ref
            ref={scrollRef}
            onTouchStart={handleTouchMove}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchMove}
            onScroll={onScroll}
            className={`h-full ${
              position === "top" ? "overflow-y-scroll" : " overflow-hidden"
            } `}
          >
            <div className=" absolute top-0">{`drag:${isDrag}`}</div>

            {children}
          </div>
        </motion.div>,

        document.body,
      )}
    </>
  );
};

export { FramerBottomSheet2 };
