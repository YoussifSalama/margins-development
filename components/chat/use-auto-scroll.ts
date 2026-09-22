import { useEffect, useRef, useState } from "react";

// From shadcn-chatbot-kit (https://shadcn-chatbot-kit.vercel.app/r/use-auto-scroll.json), MIT.
// Stays pinned to the bottom on new messages, but a deliberate scroll-up releases it —
// so reading old messages while a reply streams in doesn't get yanked back down.
const ACTIVATION_THRESHOLD = 50;
const MIN_SCROLL_UP_THRESHOLD = 10;

export function useAutoScroll(dependencies: React.DependencyList) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousScrollTop = useRef<number | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceFromBottom = Math.abs(scrollHeight - scrollTop - clientHeight);
    const isScrollingUp = previousScrollTop.current ? scrollTop < previousScrollTop.current : false;
    const scrollUpDistance = previousScrollTop.current ? previousScrollTop.current - scrollTop : 0;

    if (isScrollingUp && scrollUpDistance > MIN_SCROLL_UP_THRESHOLD) setShouldAutoScroll(false);
    else setShouldAutoScroll(distanceFromBottom < ACTIVATION_THRESHOLD);

    previousScrollTop.current = scrollTop;
  };

  useEffect(() => {
    if (containerRef.current) previousScrollTop.current = containerRef.current.scrollTop;
  }, []);

  useEffect(() => {
    if (shouldAutoScroll) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { containerRef, scrollToBottom, handleScroll, shouldAutoScroll, handleTouchStart: () => setShouldAutoScroll(false) };
}
