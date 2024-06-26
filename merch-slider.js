document.addEventListener("DOMContentLoaded", () => {
  let galleryThumbs = new Swiper('.merch-left__thumbs', {
    spaceBetween: 10,
    slidesPerView: 4,
    direction: 'vertical',
    loop: true,
    freeMode: true,
    loopedSlides: 5, // looped slides should be the same
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });

  let galleryTop = new Swiper('.merch-left__top', {
    spaceBetween: 10,
    loop: true,
    loopedSlides: 5, // looped slides should be the same
    thumbs: {
      swiper: galleryThumbs,
    },
    pagination: {
      el: '.merch-left__pagination',
      clickable: true,
    },
  });
})


document.addEventListener("DOMContentLoaded", () => {
  const merchRightSizesItems = document.querySelectorAll('.merch-rgiht__sizes-item');
  const sizeInput = document.getElementById('size');

  merchRightSizesItems.forEach(item => {
    item.addEventListener('click', () => {
      sizeInput.value = ''; // Очистка инпута перед вставкой
      sizeInput.value = item.textContent; // Вставка текста из элемента
    });
  });
})

document.addEventListener('DOMContentLoaded', () => {
  const updateValue = (increment) => {
      const numberInput = document.querySelector('.merch-rgiht__form-buttons-number');
      let currentValue = parseInt(numberInput.value);
      const newValue = currentValue + increment;
      if (newValue >= parseInt(numberInput.min) && newValue <= parseInt(numberInput.max)) {
          numberInput.value = newValue;
      }
  };

  document.querySelector('.merch-rgiht__form-minus').addEventListener('click', () => updateValue(-1));
  document.querySelector('.merch-rgiht__form-plus').addEventListener('click', () => updateValue(1));
});