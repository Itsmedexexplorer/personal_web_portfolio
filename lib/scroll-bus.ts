// One scroll loop for the whole page. Components subscribe instead of adding their own listeners.
type Listener = (y: number) => void;
const listeners = new Set<Listener>();

export function onScrollFrame(fn: Listener) {
  listeners.add(fn);
  fn(typeof window === "undefined" ? 0 : window.scrollY);
  return () => void listeners.delete(fn);
}

export function emitScroll(y: number) {
  listeners.forEach((fn) => fn(y));
}

type ScrollTo = (y: number) => void;
let scrollToImpl: ScrollTo = (y) => window.scrollTo({ top: y, behavior: "smooth" });
export const setScrollTo = (fn: ScrollTo) => void (scrollToImpl = fn);
export const scrollToY = (y: number) => scrollToImpl(y);

type Lock = (locked: boolean) => void;
let lockImpl: Lock = (locked) => void (document.documentElement.style.overflow = locked ? "hidden" : "");
export const setScrollLock = (fn: Lock) => void (lockImpl = fn);
export const lockScroll = (locked: boolean) => lockImpl(locked);
