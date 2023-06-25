import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";
import { PanInfo, motion, useAnimation, useScroll } from "framer-motion";
import React, {
  ReactNode,
  WheelEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useScrollLock } from "src/hooks/useScrollLock";
import { createPortal } from "react-dom";
import { useGesture } from "@use-gesture/react";

// ! 요구사항
// ! 바텀시트는 Number[]로 이루어진 좌표로 snap이 가능해야한다. (framer-motion)
// ! 조절할 수 있는 BottomSheet Height
// ! 바텀 시트 요소에 스크롤이 있을 때 다른요소로의 이벤트 전파를 막아야함 (body-scroll-lock)
// ! 바텀시트 상단의 핸들러를 통해서도 드래그 컨트롤 및 콜백함수

//! 문제1 - wheel로 바텀시트 맨위/아래로 올라가면 스크롤락이 풀리지않음
//! 문제2 - 모바일에서는 하단 스크롤이 전파됨

const FramerBottomSheet = ({ children }: { children: ReactNode }) => {
  const controls = useAnimation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState("top");
  const [isDrag, setIsDrag] = useState(true);
  const { scrollY } = useScroll({ container: sheetRef });
  const [touch, setTouch] = useState(0);
  const previousScrollYPosition = useRef(0);

  const reserveScrollBarGap = true;

  const scrollLockRef = useScrollLock({
    targetRef: sheetRef,
    enabled: true,
    reserveScrollBarGap,
  });

  //사용자가 스크롤을 내렸는지 올렸는지
  // const scrollUp = scrollY.get() <= scrollY.getPrevious()

  // 자식요소의 스크롤 위치 === 0이면 맨 위인것
  // const scrollPosition = sheetRef.current.scrollTop
  // 자식요소의 스크롤 높이,
  // const scrollHeight =
  // sheetRef.current.scrollHeight - sheetRef.current.offsetHeight
  // 자식요소가 맨 아래일 때
  // const scrollBottom = scrollHeight === scrollPosition

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    console.log("onDragEnd");
    const top = sheetRef.current!.scrollTop;
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y > 5 && info.point.y > 45);
    if (shouldClose) {
      console.log("닫기");
      controls.start("bottom");
      setPosition("bottom");
    } else {
      console.log("열기");
      controls.start("top");
      setPosition("top");
    }
    if (top === 0) {
      setIsDrag(true);
    } else {
      setIsDrag(false);
      scrollLockRef.current.deactivate();
    }
  };

  //! finally - 바텀시트의 컨트롤이 끝났을땐 언제나 바디 활성화
  //! 연속으로 스크롤 시 바디가 계속 활성화되어 스크롤이 전파됨
  const OnTouchEnd = () => {
    // 자식요소의 스크롤 위치 === 0이면 맨 위인것
    const scrollPosition = sheetRef.current!.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      sheetRef.current!.scrollHeight - sheetRef.current!.offsetHeight;
    // 자식요소가 맨 아래일 때
    const isScrollBottom = scrollHeight === scrollPosition;

    // ! 스크롤이 맨위,아래인데 계속 할 경우에만 잠궈놓고 아니면 바디 활성화
    // if (isScrollTop) {
    //   scrollLockRef.current.deactivate();
    // }
    // if (isScrollBottom) {
    //   scrollLockRef.current.deactivate();
    // }
    //스크롤이 남아있다면 잠금, 없으면 해제
    const hasScroll =
      sheetRef.current!.scrollHeight > sheetRef.current!.clientHeight;
    console.log("touchend : ");
    // if (hasScroll) {
    //   scrollLockRef.current.activate();
    // } else {
    //   scrollLockRef.current.deactivate();
    // }

    if (isScrollTop) {
      setIsDrag(true);
    }

    scrollLockRef.current.deactivate();
  };

  const OnTouchStart = () => {
    scrollLockRef.current.activate();
  };

  const onPan = (e: any, info: PanInfo) => {
    const direction = getDirection(info);
    console.log(`You are dragging towards ${direction}`);
  };

  const getDirection = (info: PanInfo) => {
    const x = info.velocity.x;
    const y = info.velocity.y;

    // 정확한 방향을 위해 절대값 비교
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? "right" : "left";
    } else {
      return y > 0 ? "down" : "up";
    }
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollYPosition = e.currentTarget.scrollTop;
    // 자식요소의 스크롤 위치 === 0이면 맨 위인것
    const scrollPosition = sheetRef.current!.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      sheetRef.current!.scrollHeight - sheetRef.current!.offsetHeight;
    // 자식요소가 맨 아래일 때
    const isScrollBottom = scrollHeight === scrollPosition;

    //스크롤 있는지 여부
    const hasScroll =
      sheetRef.current!.scrollHeight > sheetRef.current!.clientHeight;

    // 스크롤 방향 판별
    if (currentScrollYPosition > previousScrollYPosition.current) {
      console.log("You are scrolling down");
      //! 내리는중이고 스크롤 Bottom일때 잠금
      if (isScrollBottom) {
        console.log("스크롤 맨 아래라 잠금");
        scrollLockRef.current.activate();
      }
      //! 내리는중인데 스크롤이 존재한다면 요소 잠금
      if (hasScroll) {
        setIsDrag(false);
      }
    } else {
      // ! 올리는중이고 스크롤TOP일때 잠금
      if (isScrollTop) {
        setIsDrag(true);
        scrollLockRef.current.activate();
      }
      console.log("You are scrolling up");
    }
    // 스크롤이 맨 아래에 도달했을 때 스크롤락 해제 시점을 따로 체크
    // if (isScrollBottom && previousScrollYPosition.current === scrollHeight) {
    //   document.addEventListener("wheel", preventBodyScroll, { passive: false });
    // } else {
    //   document.removeEventListener("wheel", preventBodyScroll);
    // }

    // 현재 스크롤 위치를 기록
    previousScrollYPosition.current = currentScrollYPosition;
  };

  const preventBodyScroll = (e: WheelEvent) => {
    e.preventDefault();
    scrollLockRef.current.deactivate();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0] || !e.changedTouches[0]) return;
    setTouch((prev) => prev + 1);
    // 자식요소의 스크롤 위치 === 0이면 맨 위인것
    const scrollPosition = sheetRef.current!.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      sheetRef.current!.scrollHeight - sheetRef.current!.offsetHeight;
    // 자식요소가 맨 아래일 때
    const isScrollBottom = scrollHeight === scrollPosition;
    const touchStartY = e.touches[0].clientY;
    const touchEndY = e.changedTouches[0].clientY;

    if (touchEndY > touchStartY) {
      console.log("You slid down");
      if (isScrollTop) {
        scrollLockRef.current.activate();
        setIsDrag(true);
      }
    } else {
      console.log("You slid up");
      if (isScrollBottom) {
        scrollLockRef.current.activate();
      }
    }
  };

  const handleWheel = (e: any) => {
    const scrollPosition = sheetRef.current!.scrollTop;
    const isScrollTop = scrollPosition === 0;
    // 자식요소의 스크롤 높이,
    const scrollHeight =
      sheetRef.current!.scrollHeight - sheetRef.current!.offsetHeight;
    // 자식요소가 맨 아래일 때
    const isScrollBottom = scrollHeight === scrollPosition;

    //스크롤 있는지 여부
    const hasScroll =
      sheetRef.current!.scrollHeight > sheetRef.current!.clientHeight;

    if (isScrollBottom) {
      console.log("맨ㅇ 아래야 그만내려 : ");

      //   e.stopPropagation();

      scrollLockRef.current.activate();
    } else {
      scrollLockRef.current.deactivate();
    }
    if (isScrollTop) {
      setIsDrag(true);
    }
  };

  return (
    <>
      {createPortal(
        <motion.div
          // data-body-scroll-lock-ignore
          onDragEnd={onDragEnd}
          ref={containerRef}
          drag={isDrag ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          variants={{
            top: { bottom: 0 },
            bottom: { bottom: "-30vh" },
          }}
          initial={position}
          animate={controls}
          style={{
            // background: "white",
            // height: "40vh",
            // width: "100vw",
            // position: "fixed",
            // overflow: "hidden",
            // bottom: 0,
            // left: 0,
            // borderTopLeftRadius: "20px",
            // borderTopRightRadius: "20px",
            boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
            // touchAction: "none",
          }}
          className="bg-white w-[100vw] fixed overflow-hidden bottom-0 left-0  rounded-t-3xl  h-[40vh]"
          transition={{ type: "spring", bounce: 0 }}
        >
          {/* Sheet Content */}
          <div className=" absolute w-full h-10 bg-red-200 text-center">
            헤더
            {`isDrag:${isDrag}`}
            {`touch:${touch}`}
          </div>

          <motion.div
            // onTouchStart={OnTouchStart}
            onTouchEnd={OnTouchEnd}
            onTouchMove={handleTouchMove}
            onScroll={onScroll}
            onWheel={handleWheel}
            // onPan={onPan}
            className={`h-full ${
              position === "top" ? "overflow-auto" : " overflow-hidden"
            } `}
            ref={sheetRef}
          >
            {children}
          </motion.div>
        </motion.div>,
        document.body,
      )}
    </>
  );
};

export { FramerBottomSheet };
