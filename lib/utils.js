import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function getScrollAnimation() {
	return ({
    offscreen: {
      y: 150,
      opacity: 0,
    },
    onscreen: ({duration = 2} = {}) =>  ({
      y: 0,
      opacity: 1,
      transition: {
      type: "spring",
      duration,
      }
    })
  })
}