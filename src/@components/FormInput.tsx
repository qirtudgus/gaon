import { FC, InputHTMLAttributes, Ref, forwardRef } from "react";

interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export const BasicInput: FC<BasicInputProps> = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <>
        <div>{}</div>
        <input
          className="border-b rounded  bg-yellow-300"
          {...props}
          onClick={() => {
            console.log("");
            console.log("ddd");
            console.log("g2:");
          }}
          ref={ref}
        />
      </>
    );
  },
);
