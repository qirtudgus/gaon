//TODO [] - top,드래그를 올릴 때, scroll 없을 때 바텀시트 안올라가게
//TODO [] - ios에서 오버스크롤링 삭제하기
//TODO [] - tailwindCSS 의존성 제거하기
//TODO [] - overlay 만들기
//TODO [] - ESC, overlay touch로 bottomSheet 닫기

import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PanInfo, motion, useAnimation, useDragControls } from "framer-motion";
import { useWindowSize } from "react-use";
import { createPortal } from "react-dom";
interface FramerBottomSheetProps extends PropsWithChildren {
  /**
   * 바텀시트 렌더링 시 초기 위치
   * @default ['bottom']
   * ```jsx
   * <FramerBottomSheet3 initialPostion={'top'}>
   * ```
   */
  initialPosition: "top" | "bottom";
  /**
   * 바텀시트가 열린 후 실행될 콜백 함수
   * ```jsx
   * <FramerBottomSheet3 onOpenEnd={()=>{setState(true)}}>
   * ```
   */
  onOpenEnd?: (event?: MouseEvent | TouchEvent | PointerEvent) => void;
  /**
   * 바텀시트가 닫힌 후 실행될 콜백 함수
   * ```jsx
   * <FramerBottomSheet3 onCloseEnd={()=>{setState(true)}}>
   * ```
   */
  onCloseEnd?: (event?: MouseEvent | TouchEvent | PointerEvent) => void;
  /**
   * 헤더 컴포넌트 렌더링 여부
   * @default [true]
   */
  header?: boolean;
  headerElement?: ReactNode;
  /**
   * 바텀시트 스냅포인트
   */
  snapPoint: [number, number];
  sheetHeight?: number;
  /**
   * 바텀시트가 내려가있을때 content scrollLock 여부
   * header가 없을 경우 true를 주면 시트가 핸들링됨
   * @default [false]
   */
  bottomScrollLock?: boolean;
}
const FramerBottomSheet3: FC<FramerBottomSheetProps> = ({
  initialPosition = "bottom",
  onOpenEnd,
  onCloseEnd,
  header = true,
  headerElement,
  snapPoint = [68, 700],
  sheetHeight,
  children,
  bottomScrollLock = false,
}) => {
  const { height } = useWindowSize();
  const heightVariantMemo = useMemo(() => {
    return {
      top: { top: `${height - snapPoint[1]}px` },
      bottom: { top: `${height - snapPoint[0]}px` },
    };
  }, [height, snapPoint]);
  const maxHeightMemo = useMemo(() => Math.max(...snapPoint), [snapPoint]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const preventScrollingRef = useRef(false);
  const contentTouchedRef = useRef(false);
  const touchStartRef = useRef(0);
  const [position, setPosition] = useState(initialPosition);
  const controls = useAnimation();

  const controlsDrag = useDragControls();

  // content 영역을 터치하는 것을 기록합니다.
  useEffect(() => {
    if (!scrollRef.current) return;
    const handleTouchStart = (e: TouchEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const hasScroll =
        scrollRef.current!.scrollHeight > scrollRef.current!.clientHeight;
      contentTouchedRef.current = true;
      preventScrollingRef.current = hasScroll;
      touchStartRef.current = e.touches[0]?.clientY ?? 0;
      console.log("touchedRef.current : ", contentTouchedRef.current);
      console.log("preventScrollingRef: ", preventScrollingRef.current);
      console.log("touchStartRef.current: ", touchStartRef.current);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const hasScroll =
        scrollRef.current!.scrollHeight > scrollRef.current!.clientHeight;
      contentTouchedRef.current = false;
      preventScrollingRef.current = hasScroll;
      console.log("touchedRef.current : ", contentTouchedRef.current);
      console.log("preventScrollingRef: ", preventScrollingRef.current);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touchEndY = e.touches[0].clientY;
      if (touchEndY > touchStartRef.current) {
        console.log("You slid down");
        //스크롤이 아예 존재하지않을 때
        if (!preventScrollingRef.current) {
          e.preventDefault();
          return;
          //스크롤이 존재하고 top 0일때
        } else if (
          preventScrollingRef.current &&
          scrollRef.current!.scrollTop <= 0
        ) {
          e.preventDefault();
        }
      } else {
        console.log("You slid up");
        //! top이고 올릴 때고 scroll 없을 때 요소 안올라가게 #1
        if (!preventScrollingRef.current && position === "top") {
          return;
        }
        // ! 헤더를 사용하지않지만 스크롤이 없는 요소일 때
        if (contentTouchedRef.current && !preventScrollingRef.current) {
          e.preventDefault();
        } else if (bottomScrollLock && position === "bottom") {
          e.preventDefault();
        }
      }
    };

    //! ios 오버스크롤
    let prevValue = 0;
    const preventSafariOverscrollOnStart = (e: TouchEvent) => {
      if (scrollRef.current!.scrollTop < 0) {
        prevValue = scrollRef.current!!.scrollTop;
      }
    };

    const preventSafariOverscrollOnMove = (e: TouchEvent) => {
      if (
        scrollRef.current!.scrollTop < 0 &&
        scrollRef.current!.scrollTop < prevValue
      ) {
        e.preventDefault();
      }
    };

    scrollRef.current.addEventListener("touchstart", handleTouchStart);
    scrollRef.current.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    scrollRef.current.addEventListener("touchend", handleTouchEnd);
    scrollRef.current.addEventListener(
      "touchmove",
      preventSafariOverscrollOnMove,
    );
    scrollRef.current.addEventListener(
      "touchstart",
      preventSafariOverscrollOnStart,
      { passive: true },
    );

    return () => {
      if (!scrollRef.current) return;
      scrollRef.current.removeEventListener("touchstart", handleTouchStart);
      scrollRef.current.removeEventListener("touchmove", handleTouchMove);
      scrollRef.current.removeEventListener("touchend", handleTouchEnd);
      scrollRef.current.removeEventListener(
        "touchmove",
        preventSafariOverscrollOnMove,
      );
      scrollRef.current.removeEventListener(
        "touchstart",
        preventSafariOverscrollOnStart,
      );
    };
  }, [bottomScrollLock, header, position]);
  const onDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!scrollRef.current) return;
    const speedY = info.velocity.y;
    const shouldClose = speedY > 45;
    const shouldOpen = speedY < -45;
    if (shouldClose) {
      console.log("닫기");
      setPosition("bottom");
      onCloseEnd && (await onCloseEnd(event));
    } else if (shouldOpen) {
      console.log("열기");
      setPosition("top");
      onOpenEnd && (await onOpenEnd(event));
    }
  };
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);
  //열고 닫기
  useEffect(() => {
    controls.start(position);
  }, [controls, position]);
  //! 뷰포트 리사이징 대응
  useLayoutEffect(() => {
    controls.start(initialPosition, { duration: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);
  return (
    <>
      {createPortal(
        <motion.div
          ref={containerRef}
          onDragEnd={onDragEnd}
          drag="y"
          initial={position}
          animate={controls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.7}
          variants={heightVariantMemo}
          dragTransition={{ min: 0, max: 0, bounceStiffness: 400 }}
          transition={{
            type: "just",
          }}
          data-container
          className={`fixed bottom-0 left-0 z-[3] flex w-screen flex-col overflow-hidden overscroll-none rounded-t-3xl bg-red-200 shadow-[0_-3px_7px_0_rgba(0,0,0,0.1)]`}
          style={{
            height: sheetHeight ?? maxHeightMemo,
            WebkitTouchCallout: "none",
          }}
        >
          {header && <div className="h-fit shrink-0">{headerElement}</div>}
          <motion.div
            onPointerDownCapture={(e) => {
              if (scrollRef.current!.scrollTop !== 0) {
                e.stopPropagation();
              }
            }}
            data-scroll-test
            ref={scrollRef}
            className={`h-full shrink-0 grow select-auto overscroll-contain
              ${
                bottomScrollLock && position === "bottom"
                  ? "overflow-hidden"
                  : "overflow-auto"
              }
             `}
          >
            <div ref={contentRef}>
              <p>height : {height}</p>
              {children}
            </div>
          </motion.div>
        </motion.div>,
        document.body,
      )}
    </>
  );
};
export { FramerBottomSheet3 };
