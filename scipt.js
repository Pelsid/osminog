/*---------------------------------
      MENU-BURGER
---------------------------------*/
function showMenu() {
  const headerMenu = document.querySelector(".header");
  const body = document.body;

  if (headerMenu && body) {
    // Toggle menu visibility
    headerMenu.classList.toggle("header_show");

    // Toggle body overflow
    body.style.overflow = body.style.overflow === "hidden" ? "" : "hidden";
  }
}

/*---------------------------------
      DOCUMENT READY
---------------------------------*/
document.addEventListener("DOMContentLoaded", () => {

  /*---------------------------------
        PHONE MASK
  ---------------------------------*/
  const phoneInput = $(".form-input--phone");
  if (phoneInput.length) {
    phoneInput.on("input", function () {
      $(this).toggleClass("form-input--phone--active", this.value.trim() !== "");
    });
    phoneInput.mask("+7(000) 000 0000");
  }

  /*---------------------------------
        MODAL MANAGEMENT
  ---------------------------------*/
  const toggleModalClass = (nameModal, newClass, action) => {
    document.querySelectorAll(`.${nameModal}`).forEach((element) => {
      element.classList[action](newClass);
    });
    if (action === "remove") document.body.style.overflowY = "auto";
  };

  window.openModal = (nameModal, newClass) =>
    toggleModalClass(nameModal, newClass, "add");
  window.closeModal = (nameModal, newClass) =>
    toggleModalClass(nameModal, newClass, "remove");

  /*---------------------------------
        LINKS-BACKGROUNDS
  ---------------------------------*/
  const items = document.querySelectorAll('.links-backgrounds__item');
  const isWideScreen = window.innerWidth > 1220;

  if (items.length) {
    if (isWideScreen) {
      items.forEach(item => {
        item.addEventListener('mouseover', () => {
          items.forEach(el => el.classList.remove('links-backgrounds__item_active'));
          item.classList.add('links-backgrounds__item_active');
        });

        item.addEventListener('mouseout', () => {
          item.classList.remove('links-backgrounds__item_active');
        });
      });
    } else {
      items.forEach(el => el.classList.remove('links-backgrounds__item_active'));

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observerCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('links-backgrounds__item_active');
            }, 300);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      items.forEach(item => observer.observe(item));
    }
  }

  /*---------------------------------
        SPOILERS
  ---------------------------------*/
  const spoilers = document.querySelectorAll('.spoilers__item');
  if (spoilers.length) {
    spoilers.forEach(spoiler => {
      spoiler.addEventListener('click', () => {
        spoilers.forEach(s => s.classList.remove('spoilers__item_active'));
        spoiler.classList.toggle('spoilers__item_active');
      });
    });
  }

  /*---------------------------------
        CARDS MODAL
  ---------------------------------*/
  const modal = document.querySelector('.slider-cards__modal');
  const modalCross = document.querySelector('.slider-cards__modal-cross');

  if (modal && modalCross) {
    const showModal = () => {
      modal.classList.add('slider-cards__modal--active');
    };

    setInterval(() => {
      document.querySelectorAll('.slider-cards__slide').forEach(item => {
        item.removeEventListener('click', showModal);
      });
      const activeSlide = document.querySelector('.slider-cards__slide.show');
      if (activeSlide) {
        activeSlide.addEventListener('click', showModal);
      }
    }, 500);

    modalCross.addEventListener('click', () => {
      modal.classList.remove('slider-cards__modal--active');
    });
  }

  /*---------------------------------
        PREVIEW-PORTFOLIO
  ---------------------------------*/
  const portfolios = document.querySelectorAll('.preview-portfolio');

  if (portfolios.length) {
    const observerOptionsPortfolio = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallbackPortfolio = (entries, observer) => {
      entries.forEach(entry => {
        const portfolio = entry.target;
        const lines = portfolio.querySelectorAll('.preview-portfolio__line');

        if (entry.isIntersecting) {
          const handleScroll = () => onScroll(portfolio, lines);
          portfolio.handleScroll = handleScroll;
          window.addEventListener('scroll', handleScroll);
        } else {
          window.removeEventListener('scroll', portfolio.handleScroll);
        }
      });
    };

    const onScroll = (portfolio, lines) => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const portfolioPosition = portfolio.getBoundingClientRect().top + window.scrollY;

      lines.forEach((line, index) => {
        const items = line.querySelectorAll('.preview-portfolio__line-item');
        items.forEach(item => {
          let scrollFactor;
          const baseTransform = index === 1 ? -60 : -20;
          if (window.innerWidth > 1220) {
            scrollFactor = (scrollPosition - portfolioPosition) * 0.01;
          } else {
            scrollFactor = (scrollPosition - portfolioPosition) * 0.03;
          }
          const transformValue = index === 1
            ? Math.min(0, baseTransform - scrollFactor)
            : Math.min(0, baseTransform + scrollFactor);
          item.style.transform = `translateX(${transformValue}%)`;
        });
      });
    };

    const observerPortfolio = new IntersectionObserver(observerCallbackPortfolio, observerOptionsPortfolio);
    portfolios.forEach(portfolio => observerPortfolio.observe(portfolio));
  }

  /*---------------------------------
        COMPANY-FOLLOWERS__COMPANY-BLOCK
  ---------------------------------*/
  if (window.innerWidth > 1220) {
    const companyBlock = document.querySelector('.company-followers__company-block');
    const companyBlockSecond = document.querySelector('.company-followers__company-block--second');
    const wrapper = document.querySelector('.company-followers__company-block-wrapper');

    if (companyBlock && companyBlockSecond && wrapper) {
      let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let isInView = false;
      let currentOffset = 0; // To store the current offset

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isInView = entry.isIntersecting;
          if (isInView) {
            lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.addEventListener('scroll', onScrollCompany);
          } else {
            window.removeEventListener('scroll', onScrollCompany);
          }
        });
      }, {
        root: null,
        threshold: 0
      });

      observer.observe(wrapper);

      function onScrollCompany() {
        if (!isInView) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offset = (scrollTop - lastScrollTop) * 0.05;

        // Update the current offset
        currentOffset += offset;

        // Set the transform with the new offset
        companyBlock.style.transform = `translateX(${100 - currentOffset * 2}%)`;
        companyBlockSecond.style.transform = `translateX(${-100 + currentOffset * 2}%)`;

        // Update lastScrollTop
        lastScrollTop = scrollTop;
      }
    }
  }

  /*---------------------------------
        VIDEO REVIEW
  ---------------------------------*/
  const container = document.querySelector('.video-review__videos-container');
  const wrapper = document.querySelector('.video-review__videos-wrapper');
  const slides = document.querySelectorAll('.video-review__video-block');
  let slideWidth = slides[0]?.clientWidth || 0;
  const marginRight = parseInt(window.getComputedStyle(slides[0])?.marginRight || 0);
  let currentIndex = 0;
  let startX = 0;
  let endX = 0;

  const updateTransform = () => {
    wrapper.style.transform = `translateX(${-currentIndex * (slideWidth + marginRight)}px)`;
    slides.forEach((slide, index) => {
      slide.classList.toggle('show', index === currentIndex);
    });
  };

  if (container && wrapper && slides.length) {
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

    container.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      container.addEventListener('mousemove', onMouseMove);
    });

    container.addEventListener('mouseup', (e) => {
      endX = e.clientX;
      container.removeEventListener('mousemove', onMouseMove);
      handleSwipe();
    });

    const onMouseMove = (e) => {
      endX = e.clientX;
    };

    const handleSwipe = () => {
      const threshold = 50;
      if (endX - startX > threshold) {
        currentIndex = Math.max(currentIndex - 1, 0);
      } else if (startX - endX > threshold) {
        currentIndex = Math.min(currentIndex + 1, slides.length - 1);
      }
      updateTransform();
    };

    window.addEventListener('resize', () => {
      slideWidth = slides[0].clientWidth;
      updateTransform();
    });

    updateTransform();
  }

  /*---------------------------------
        VIDEO REVIEW CLICK
  ---------------------------------*/
  const videoBlocks = document.querySelectorAll(".video-review__video-block");

  if (videoBlocks.length) {
    videoBlocks.forEach(videoBlock => {
      const reviewGif = videoBlock.querySelector(".video-review__gif-wrap");
      const video = videoBlock.querySelector(".video-review__video");

      if (reviewGif && video) {
        videoBlock.addEventListener("click", () => {
          videoBlocks.forEach(block => {
            const blockVideo = block.querySelector(".video-review__video");
            const blockGif = block.querySelector(".video-review__gif-wrap");

            if (blockVideo && blockGif && blockVideo !== video) {
              blockVideo.pause();
              blockGif.classList.remove("video-review__gif-wrap--hide");
            }
          });

          if (video.paused) {
            video.play();
            reviewGif.classList.add("video-review__gif-wrap--hide");
          } else {
            video.pause();
            reviewGif.classList.remove("video-review__gif-wrap--hide");
          }
        });
      }
    });
  }

  /*---------------------------------
        PAGINATION
  ---------------------------------*/
  const paginationWraps = document.querySelectorAll('.pagination-wrap');

  if (paginationWraps.length) {
    paginationWraps.forEach(paginationWrap => {
      const slides = paginationWrap.querySelectorAll('.pagination-slide');
      const paginationSlides = paginationWrap.nextElementSibling;

      if (slides.length && paginationSlides) {
        slides.forEach((slide, index) => {
          const paginationItem = document.createElement('div');
          paginationItem.classList.add('pagination-item');
          paginationSlides.appendChild(paginationItem);
        });

        const updatePagination = () => {
          slides.forEach((slide, index) => {
            const paginationItem = paginationSlides.children[index];
            paginationItem.classList.toggle('show', slide.classList.contains('show'));
          });
        };

        setInterval(updatePagination, 100);
      }
    });
  }

  /*---------------------------------

    OPEN RIGHT MODAL

---------------------------------*/

  function openModal(nameModal, newClass, overflow) {
    // Отображаем выбранное модальное окно
    let selectedModals = document.querySelectorAll('.' + nameModal);

    // Проходим по каждому элементу и добавляем класс newClass
    selectedModals.forEach(element => {
      element.classList.add(newClass);
    });

    if (!overflow) {
      // Добавляем или удаляем overflow-y: hidden
      document.body.style.overflowY = 'hidden';
    }
  }



  /*---------------------------------
  
      CLOSE RIGHT MODAL
  
  ---------------------------------*/

  function closeModal(nameModal, newClass) {
    // Выбираем все элементы с классом nameModal
    var selectedModals = document.querySelectorAll('.' + nameModal);

    // Проходим по каждому элементу и удаляем класс newClass
    selectedModals.forEach(element => {
      element.classList.remove(newClass);
    });

    // Восстанавливаем overflow-y: auto у body
    document.body.style.overflowY = 'auto';
  }
});
