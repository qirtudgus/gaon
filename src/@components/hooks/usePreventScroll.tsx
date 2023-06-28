import { useEffect, useLayoutEffect, useRef } from "react";

import { UsePreventScrollProps } from "../interface/framerBottomSheet.interface";

/**
 * 스크롤 여부를 판단하여 바텀시트의
 * 작동 방식을 핸들링합니다.
 * @returns
 */
const usePreventScroll = ({
  scrollRef,
  bottomScrollLock,
  position,
  header,
}: UsePreventScrollProps) => {
  const isContentTouchedRef = useRef(false); // content가 터치 되었는지를 추적
  const hasScrolledRef = useRef(false); // 요소에 스크롤이 존재하는지를 추적
  const initialTouchYCoordRef = useRef(0); // 터치 방향을 추적하기위한 최초 터치의 Y좌표값
  const isScrollTopRef = useRef(true);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    const handleTouchStart = (e: TouchEvent) => {
      if (!scrollRef.current) return;

      if (scrollRef.current.scrollTop <= 0) {
        isScrollTopRef.current = true;
      }

      const hasScroll =
        scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
      isContentTouchedRef.current = true;
      hasScrolledRef.current = hasScroll;
      initialTouchYCoordRef.current = e.touches[0]?.clientY ?? 0;
      console.log(" hasScrolledRef: ", hasScrolledRef);
      console.log(" isScrollTopRef: ", isScrollTopRef);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!scrollRef.current) return;
      if (scrollRef.current.scrollTop > 0) {
        isScrollTopRef.current = false;
      }

      const hasScroll =
        scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
      isContentTouchedRef.current = false;
      hasScrolledRef.current = hasScroll;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      if (!scrollRef.current) return;
      const touchEndY = e.touches[0].clientY;

      const isSlideDown = touchEndY > initialTouchYCoordRef.current;
      const hasScroll = hasScrolledRef.current;
      const isTopPosition = position === "top";

      if (scrollRef.current.scrollTop <= 0) {
        isScrollTopRef.current = true;
      } else {
        isScrollTopRef.current = false;
      }

      // 아래로 슬라이드 될 때
      if (isSlideDown) {
        const isNoScroll = !hasScroll;
        const isTopOfScroll = hasScroll && scrollRef.current.scrollTop <= 0;
        if (isNoScroll || isTopOfScroll) {
          e.preventDefault();
        }
      }
      // 위로 슬라이드 될 때
      else {
        const isNoScrollAndTop = !hasScroll && isTopPosition; // 스크롤이 없고, 현재 위치가 'top'인지 확인
        const isTouchedNoScrollContent =
          isContentTouchedRef.current && !hasScroll; // content가 터치되었고, 스크롤이 없는지 확인
        const isBottomLocked = bottomScrollLock && position === "bottom"; // 바텀일 때 스크롤이 잠금이 true인지, 현재 위치가 'bottom'인지 확인

        // 스크롤 요소가 없고, 현재 위치가 'top'이라면
        if (isNoScrollAndTop) {
          e.preventDefault();
        }
        if (isTouchedNoScrollContent || isBottomLocked) {
          e.preventDefault();
        }
      }
    };

    let prevValue = 0;
    const preventSafariOverscrollOnStart = (e: TouchEvent) => {
      if (!scrollRef.current) return;
      if (scrollRef.current.scrollTop < 0) {
        prevValue = scrollRef.current.scrollTop;
      }
    };

    const preventSafariOverscrollOnMove = (e: TouchEvent) => {
      if (!scrollRef.current) return;
      if (
        scrollRef.current.scrollTop < 0 &&
        scrollRef.current.scrollTop < prevValue
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
      {
        passive: true,
      },
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
  }, [scrollRef, bottomScrollLock, position]);

  return {
    isContentTouchedRef,
    hasScrolledRef,
    initialTouchYCoordRef,
    isScrollTopRef,
  };
};

export { usePreventScroll };
