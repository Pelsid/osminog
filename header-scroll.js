/*---------------------------------
      DOCUMENT READY
---------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  /*---------------------------------
        SCROLL MENU
  ---------------------------------*/
  const header = document.querySelector(".header");
  const upperSection = document.querySelector(".upper-section");
  const offset = 90;

  const handleScroll = () => {
    const upperSectionRect = upperSection.getBoundingClientRect();
    header.classList.toggle("header_scroll", upperSectionRect.bottom - offset <= 0);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check

});
