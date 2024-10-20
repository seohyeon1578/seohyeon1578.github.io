import { throttle } from "./throttle";

const SCROLL_THRESHOLD = 100;

const findActiveHeading = (headings: Element[]): string => {
  return headings.reduce((acc, heading) => {
    const rect = heading.getBoundingClientRect();
    return rect.top <= SCROLL_THRESHOLD ? heading.id : acc;
  }, "");
};

const updateTocItemsActiveState = (
  tocItems: Element[],
  activeHeadingId: string,
) => {
  tocItems.forEach((item) => {
    const headingSlug = item.getAttribute("data-heading");
    item.classList.toggle("active", headingSlug === activeHeadingId);
  });
};

const updateActiveHeading = () => {
  const headings = Array.from(
    document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
  );
  const tocItems = Array.from(document.querySelectorAll(".toc-item"));

  const currentActiveHeading = findActiveHeading(headings);
  updateTocItemsActiveState(tocItems, currentActiveHeading);
};

export const initTocHighlight = () => {
  const throttledUpdateActiveHeading = throttle(updateActiveHeading, 100);
  updateActiveHeading();
  window.addEventListener("scroll", throttledUpdateActiveHeading);
};
