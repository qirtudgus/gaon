//! useDragControls 사용해보기

import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

import { PanInfo, motion, useAnimation, useDragControls } from "framer-motion";
import { useWindowSize } from "react-use";
import { useDrag, useScroll } from "react-use-gesture";
import { Handler } from "@use-gesture/react";
interface FramerBottomSheetProps extends PropsWithChildren {
  initialPostion: "top" | "bottom";
}
const FramerBottomSheet3: FC<FramerBottomSheetProps> = ({
  initialPostion,
  children,
}) => {
  const { height } = useWindowSize();
  const heightVariant = {
    top: { top: `${155}px` },
    bottom: { top: `${height - 68}px` },
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousScrollYPosition = useRef(0);
  const [isDrag, setIsDrag] = useState(initialPostion === "top" ? true : false);
  const [isTop, setIsTop] = useState(false);
  const [position, setPosition] = useState(initialPostion);
  const controls = useAnimation();
  const dragControls = useDragControls();
  const bind = useDrag(
    (state) => {
      const isScrollTop =
        scrollRef.current && scrollRef.current.scrollTop === 0;
      console.log(state);
      const { direction, dragging } = state;
      if (direction[1] > 0) {
        console.log("위로 드래그 중");

        if (isScrollTop) {
          console.log("위로 드래그 중인데 맨 위임");
        }
      } else if (direction[1] < 0) {
        console.log("아래로 드래그 중");
        setIsDrag(false);
      }

      // 드래그가 끝났을 때
      if (!dragging) {
        console.log("드래그 끝");
      }
    },
    { axis: "y", filterTaps: true },
  );

  const scrollBind = useScroll(
    (state) => {
      const isScrollTop =
        scrollRef.current && scrollRef.current.scrollTop === 0;
      const { direction, dragging } = state;
      // console.log(" isScrollTop: ", isScrollTop);
      // console.log("state : ", state);
      if (direction[1] < 0) {
        console.log("위로 스크롤중 중");
        if (isScrollTop) {
          state.event.preventDefault();
          state.event.stopPropagation();
          // console.log("위로 드래그 중인데 맨 위임");
          setIsDrag(true);
          setIsTop(true);
        }
      } else if (direction[1] > 0) {
        console.log("아래로 스크롤 중");
        setIsDrag(false);
        // setIsTop(false);
      }
    },
    { axis: "y" },
  );

  const containerBind = useDrag(
    (state) => {
      const isScrollTop =
        scrollRef.current && scrollRef.current.scrollTop === 0;
      console.log(state);
      const { direction, dragging } = state;
      if (direction[1] > 0) {
        console.log("위로 드래그 중");
        if (isScrollTop) {
          console.log("위로 드래그 중인데 맨 위임");
          if (!dragging) {
            console.log("드래그 끝");
            setIsTop(true);
          }
        }
      } else if (direction[1] < 0) {
        console.log("아래로 드래그 중");

        if (position === "top") {
          if (isScrollTop) {
            setIsDrag(true);
          }
        }

        if (
          !dragging &&
          position === "top" &&
          scrollRef.current &&
          scrollRef.current.scrollTop === 0
        ) {
          console.log("드래그 끝");
          setIsDrag(true);
          // setIsTop(true);

          //   setIsTop(false);
          if (isTop && isDrag) {
            // setIsDrag(false);
            // setIsTop(false);
            //   scrollRef.current?.blur();
            // scrollRef.current?.click();
          }
        }
      }
    },
    { axis: "y" },
  );

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!scrollRef.current) return;
    console.log("info.velocity.y : ", info.velocity.y);
    console.log("info.point.y : ", info.point.y);
    const speedY = info.velocity.y;
    const shouldClose = speedY > 45;
    const shouldOpen = speedY < -45;
    if (shouldClose) {
      console.log("닫기");
      setPosition("bottom");
      //   setIsTop(false);
    } else if (shouldOpen) {
      console.log("열기");
      setPosition("top");
    }
    const scrollPosition = scrollRef.current.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // if (isScrollTop) {
    //   setIsDrag(true);
    // }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0] || !e.changedTouches[0] || !scrollRef.current) return;
    // setTouch((prev) => prev + 1);
    // 자식요소의 스크롤 위치 === 0이면 맨 위인것
    const scrollPosition = scrollRef.current.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      scrollRef.current.scrollHeight - scrollRef.current.offsetHeight;
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
    }
  };
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const currentScrollYPosition = e.currentTarget.scrollTop;
    // 자식요소의 스크롤 위치 === 0이면 맨 위인것
    const scrollPosition = scrollRef.current.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      scrollRef.current.scrollHeight - scrollRef.current.offsetHeight;
    //스크롤 있는지 여부
    const hasScroll =
      scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
    // 스크롤 방향 판별
    if (currentScrollYPosition > previousScrollYPosition.current) {
      //! 스크롤 내리는중
      console.log("You are scrolling down");
      if (hasScroll) {
        setIsDrag(false);
      }
      if (isScrollTop) {
        setIsDrag(true);
      }
    } else {
      // ! 스크롤 올리는 중
      console.log("You are scrolling up");
      if (isScrollTop) {
        setIsDrag(true);
      }
    }
    // 현재 스크롤 위치를 기록
    previousScrollYPosition.current = currentScrollYPosition;
  };

  useEffect(() => {
    controls.start(position);
  }, [position]);

  const startDrag = (e: React.PointerEvent | PointerEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      dragControls.start(e);
    } else {
      return;
    }
  };

  return (
    <>
      <div onPointerDown={startDrag} className="p-4 bg-green-500 touch-none">
        테스트
      </div>
      <motion.div
        data-container
        // {...containerBind()}
        className={`fixed bottom-0 left-0 z-[3] flex h-[100vh] w-full flex-col overflow-hidden overscroll-none rounded-t-3xl bg-red-200`}
        onDragEnd={onDragEnd}
        onPointerDown={startDrag}
        dragControls={dragControls}
        drag={isDrag ? "y" : false}
        ref={containerRef}
        initial={position}
        animate={controls}
        dragConstraints={{ top: 0, bottom: 0 }}
        draggable={true}
        dragElastic={0.7}
        variants={heightVariant}
        dragTransition={{ min: 0, max: 0, bounceStiffness: 400 }}
        transition={{
          type: "just",
        }}
      >
        <div className="h-[68px] shrink-0 bg-green-400 text-center">
          <p>
            {`헤더 drag:${isDrag}`}
            {`헤더 postion:${position}`}
            {`isTop:${isTop}`}
          </p>
        </div>
        <motion.div
          {...bind()}
          {...scrollBind()}
          data-scroll-test
          ref={scrollRef}
          //   onPointerDown={startDrag}
          //   onTouchStart={handleTouchMove}
          //   onTouchMove={handleTouchMove}
          //   onTouchEnd={handleTouchMove}
          //   onScroll={onScroll}
          className={` h-full shrink-0 grow select-auto overscroll-contain  ${
            position === "top" ? "overflow-auto" : " overflow-hidden"
          } ${isDrag ? "" : ""}`}
          style={{ touchAction: isDrag && isTop ? "none" : "auto" }}
        >
          <div ref={contentRef}>{children}</div>
        </motion.div>
      </motion.div>
    </>
  );
};
export { FramerBottomSheet3 };
