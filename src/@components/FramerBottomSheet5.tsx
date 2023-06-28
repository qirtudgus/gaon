//TODO [o] - top에서 드래그를 올릴 때,  바텀시트 안올라가게
//TODO [] - ios에서 오버스크롤링 삭제하기
//TODO [] - tailwindCSS 의존성 제거하기
//TODO [] - overlay 만들기
//TODO [] - ESC, overlay touch로 bottomSheet 닫기
//TODO [] - motion.div transition props customize
//TODO [] - dragEnd 속도가 느리다면 가까운 snapPoint로 이동하기 ?
//TODO [O] - 브라우저 주소창이 사라질 때 시트가 바로 따라오지않는 오류 수정하기

import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PanInfo, motion, useAnimation } from "framer-motion";
import { useWindowSize } from "react-use";
import { createPortal } from "react-dom";

import { usePreventScroll } from "./hooks/usePreventScroll";
import { FramerBottomSheetProps } from "./interface/framerBottomSheet.interface";
import "./interface/framerBottomSheet.css";

const FramerBottomSheet: FC<FramerBottomSheetProps> = ({
  initialPosition = "bottom",
  onOpenEnd,
  onCloseEnd,
  header = true,
  headerElement,
  snapPoint,
  bottomScrollLock = false,
  children,
  style,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isTopScroll, setIsTopScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(snapPoint.bottom.height);

  const controls = useAnimation();

  const { height } = useWindowSize();

  const heightVariantMemo = useMemo(() => {
    return {
      top: { bottom: `0px` },
      bottom: {
        bottom: `-${snapPoint.top.height - snapPoint.bottom.height}px`,
      },
    };
  }, [snapPoint]);

  const maxHeightMemo = useMemo(
    () => Math.max(...Object.values(snapPoint).map((obj) => obj.height)),
    [snapPoint],
  );

  const { isScrollTopRef } = usePreventScroll({
    scrollRef,
    bottomScrollLock,
    position,
    header,
  });

  useEffect(() => {
    setIsTopScroll(isScrollTopRef.current);
    console.log("zz : ", isTopScroll);
  }, [isScrollTopRef, isTopScroll]);

  //   const onDragEnd = async (
  //     event: MouseEvent | TouchEvent | PointerEvent,
  //     info: PanInfo,
  //   ) => {
  //     if (!scrollRef.current) return;
  //     const speedY = info.velocity.y;
  //     const shouldClose = speedY > 45;
  //     const shouldOpen = speedY < -45;
  //     if (shouldClose) {
  //       setPosition("bottom");
  //       onCloseEnd && (await onCloseEnd(event));
  //     } else if (shouldOpen) {
  //       setPosition("top");
  //       onOpenEnd && (await onOpenEnd(event));
  //     }
  //   };

  const onDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!scrollRef.current) return;
    const speedY = info.velocity.y;
    const shouldClose = speedY > 45;
    const shouldOpen = speedY < -45;
    if (shouldClose) {
      setY(snapPoint.bottom.height);
      onCloseEnd && (await onCloseEnd(event));
    } else if (shouldOpen) {
      setY(snapPoint.top.height);
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
    controls.start(position, { duration: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, height]);

  //위로 가는 드래깅 막기
  const onDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const offsetDirectionY = info.offset.y;
    // 드래그 방향이 위쪽인지 확인
    const isDraggingUp = offsetDirectionY < 0;
    if (isDraggingUp && scrollRef.current!.scrollTop === 0) {
      event.stopPropagation();
      // 위로 드래그할 때 실행할 로직을 여기에 추가하세요.
      console.log("Dragging up");
    }
  };

  return (
    <>
      {createPortal(
        <motion.div
          data-container-ref
          ref={containerRef}
          onDragEnd={onDragEnd}
          //! 맨위일때 draggin false
          dragMomentum={false}
          drag="y"
          initial={position}
          animate={controls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: position === "top" ? 0 : 0.6, bottom: 0.6 }}
          variants={heightVariantMemo}
          dragTransition={{
            min: 0,
            max: 0,
            bounceStiffness: 400,
          }}
          transition={{
            type: "just",
          }}
          className={`fixed bottom-0 left-0 z-[3] flex w-screen flex-col overflow-hidden overscroll-none rounded-t-3xl shadow-[0_-3px_7px_0_rgba(0,0,0,0.1)]`}
          style={{
            height: maxHeightMemo,
            ...style,
          }}
          onDirectionLock={(x) => console.log("onDirec", x)}
          dragDirectionLock={true}
        >
          {header && (
            <div className="h-fit shrink-0 text-center">{headerElement}</div>
          )}
          <motion.div
            data-scroll-ref
            // onDrag={onDrag}
            dragDirectionLock={true}
            onPointerDownCapture={(e) => {
              if (scrollRef.current!.scrollTop !== 0) {
                e.stopPropagation();
              }
            }}
            ref={scrollRef}
            className={`h-full shrink-0 grow select-auto overscroll-contain
                  ${
                    bottomScrollLock && position === "bottom"
                      ? "overflow-hidden"
                      : "overflow-auto"
                  }
                 `}
          >
            <div>isTopScroll:{isTopScroll}</div>
            <div ref={contentRef}>{children}</div>
          </motion.div>
        </motion.div>,
        document.body,
      )}
    </>
  );
};
export { FramerBottomSheet };
