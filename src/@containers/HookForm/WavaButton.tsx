import React, { useEffect, useRef } from "react";

interface WaveButtonProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

const WaveButton: React.FC<WaveButtonProps> = ({
  children,
  backgroundColor = "#00f",
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const startRipple = (e: MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;

    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    ripple.style.backgroundColor = darkenColor(backgroundColor, 0.2);
    button.appendChild(ripple);
    button.style.setProperty("--color", darkenColor(backgroundColor, 0.2));
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  };

  const endRipple = () => {
    const button = buttonRef.current;
    if (button) {
      button.style.setProperty("--color", backgroundColor);
    }
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.style.backgroundColor = backgroundColor;
      button.addEventListener("mousedown", startRipple);
      button.addEventListener("mouseup", endRipple);
      button.addEventListener("mouseleave", endRipple);
      return () => {
        button.removeEventListener("mousedown", startRipple);
        button.removeEventListener("mouseup", endRipple);
        button.removeEventListener("mouseleave", endRipple);
      };
    }
  }, [backgroundColor]);

  const darkenColor = (color: string, percentage: number) => {
    const amount = Math.floor(255 * percentage);
    const { r, g, b } = color.startsWith("#")
      ? {
          r: parseInt(color.slice(1, 3), 16),
          g: parseInt(color.slice(3, 5), 16),
          b: parseInt(color.slice(5, 7), 16),
        }
      : { r: 0, g: 0, b: 0 };

    return `rgb(${Math.max(0, r - amount)}, ${Math.max(
      0,
      g - amount,
    )}, ${Math.max(0, b - amount)})`;
  };

  return (
    <button ref={buttonRef} className="ripple-button w-full py-3">
      {children}
    </button>
  );
};

export default WaveButton;
