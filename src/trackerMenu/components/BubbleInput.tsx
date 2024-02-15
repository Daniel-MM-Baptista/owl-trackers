import { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  bgColor: number;
}

export default function BubbleInput({
  color,
  inputProps,
}: {
  color: number;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}): JSX.Element {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.target.select();
  };

  let backgroundColor: string;
  switch (color) {
    default:
    case 0:
      backgroundColor = "bg-fuchsia-500/40";
      break;
    case 1:
      backgroundColor = "bg-pink-600/50";
      break;
    case 2:
      backgroundColor = "bg-red-700/70";
      break;
    case 3:
      backgroundColor = "bg-lime-400/30";
      break;
    case 4:
      backgroundColor = "bg-emerald-400/30";
      break;
    case 5:
      backgroundColor = "bg-cyan-300/30";
      break;
    case 6:
      backgroundColor = "bg-blue-500/30";
      break;
  }

  return (
    <div
      className={`h-[44px] w-[44px] pb-[2px] pr-[0px] ${backgroundColor} justify-center rounded-full drop-shadow-sm duration-300 focus-within:drop-shadow-lg`}
    >
      <input
        {...inputProps}
        onFocus={handleFocus}
        className={`duration-50selection:bl h-[44px] w-[44px] justify-center rounded-full bg-transparent pb-[2px] pr-[0px] text-center font-medium  outline-none -outline-offset-2 outline-white/40 focus:bg-black/10 focus:outline-white/60`}
        placeholder=""
      ></input>
    </div>
  );
}
