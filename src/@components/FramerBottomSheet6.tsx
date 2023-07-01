//TODO [O] - top에서 드래그를 올릴 때,  바텀시트 안올라가게
//TODO [O] - dragEnd 속도가 느리다면 가까운 snapPoint로 이동하기
//TODO [O] - 브라우저 주소창이 사라질 때 시트가 바로 따라오지않는 오류 수정하기
//TODO [O] - 애니메이션 bottom 속성에서 translateY로 변경하기
//TODO [O] - 상위컴포넌트에서 사용할 useImperativeHandle 제작 ex) snapTo()
//TODO [ ] - 스크롤 위치 저장하기
//TODO [ ] - ios에서 오버스크롤링 삭제하기
//TODO [ ] - tailwindCSS 의존성 제거하기
//TODO [ ] - overlay 만들기
//TODO [ ] - ESC, overlay touch로 bottomSheet 닫기
//TODO [ ] - motion.div transition props customize

//!BUG#1 [O] - scrollTop이 0일때 scroll-X 요소에 대고 드래그(업 다운 모두)하면 시트가 급격히 내려가는 버그
//!BUG#2 [O] - Ignored attempt to cancel a touchmove event with cancelable=false, for example because scrolling is in progress and cannot be interrupted.
// * handleTouchMove의 if문에서 e.cancelable 체크
// * https://stackoverflow.com/questions/26478267/touch-move-getting-stuck-ignored-attempt-to-cancel-a-touchmove
//!BUG#3 [O] - BottomSheet x축으로 드래그하면 시트가 올라가는 버그
// * dragSnapToOrigin을 제거하고, onDragEnd에서 else문을 추가하여 원래 position 돌아가게 처리. #1 같이 fix됨
//!BUG#4 [O] - bottomScollLock을 걸지않으면 bottom에서 드래그가 되지않는 버그
// * usePreventSroll 특정 상황에서 위로 올릴때의 preventDefault() 추가
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PanInfo, motion, useAnimation } from "framer-motion";
import { useWindowSize } from "react-use";
import { createPortal } from "react-dom";

import { usePreventScroll } from "./hooks/usePreventScroll";
import {
  FramerBottomSheetType,
  SnapType,
} from "./interface/framerBottomSheet.interface";
import "./interface/framerBottomSheet.css";

const FramerBottomSheet: FramerBottomSheetType = (
  {
    initialPosition = "bottom",
    onOpenEnd,
    onCloseEnd,
    header = true,
    headerElement,
    snapPoint,
    bottomScrollLock = false,
    children,
    style,
    portalContainer,
  },
  externalRef,
) => {
  const { height } = useWindowSize();
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const maxHeight = snapPoint.top.height;
  const minHeight = snapPoint.bottom.height;

  const heightVariantMemo = useMemo(() => {
    return {
      top: { y: `0px` },
      bottom: { y: `${maxHeight - minHeight}px` },
    };
  }, [maxHeight, minHeight]);

  usePreventScroll({
    scrollRef,
    bottomScrollLock,
    position,
    header,
  });

  //외부로 노출하고 싶은 값이나 함수 정의
  useImperativeHandle(externalRef, () => ({
    snapTo: (position: SnapType) => {
      setPosition(position);
    },
    getPosition: () => {
      return position;
    },
  }));

  const handleClose = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition("bottom");
    controls.start("bottom");
    onCloseEnd && (await onCloseEnd(event));
  };

  const handleOpen = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition("top");
    controls.start("top");
    onOpenEnd && (await onOpenEnd(event));
  };

  const handleRestorePosition = () => {
    controls.start(position);
  };

  const onDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const speedY = info.velocity.y;
    const shouldClose = speedY > 45;
    const shouldOpen = speedY < -45;
    if (shouldClose) {
      await handleClose(event);
    } else if (shouldOpen) {
      await handleOpen(event);
    } else {
      handleRestorePosition();
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

  return (
    <>
      {createPortal(
        <motion.div
          data-container-ref
          ref={containerRef}
          onDragEnd={onDragEnd}
          drag={"y"}
          initial={position}
          animate={controls}
          variants={heightVariantMemo}
          dragConstraints={{
            top: 0,
            bottom: maxHeight - minHeight,
          }}
          dragMomentum={false}
          dragElastic={{ top: 0, bottom: 0 }}
          dragTransition={{ min: 0, max: 0, bounceStiffness: 400 }}
          transition={{
            type: "just",
          }}
          className={`fixed bottom-0 left-0  z-[3] flex w-screen select-auto flex-col overflow-hidden overscroll-none rounded-t-3xl shadow-[0_-3px_7px_0_rgba(0,0,0,0.1)]`}
          style={{
            height: maxHeight,
            ...style,
          }}
        >
          {header && (
            <div data-header-ref className=" h-fit shrink-0 text-center">
              {headerElement}
            </div>
          )}
          <motion.div
            data-scroll-ref
            onPointerDownCapture={(e) => {
              if (scrollRef.current && scrollRef.current.scrollTop !== 0) {
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
            <div data-content-ref ref={contentRef}>
              {children}
            </div>
          </motion.div>
        </motion.div>,
        portalContainer ?? document.body,
      )}
    </>
  );
};
const FramerBottomSheetRef = forwardRef(FramerBottomSheet);
export { FramerBottomSheetRef as FramerBottomSheet };
