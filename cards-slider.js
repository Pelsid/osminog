  // Получаем контейнер карусели слайдов
  const cardsContainer = document.querySelector(".slider-cards__wrap");

if (cardsContainer) {
  // Класс для обработки событий перетаскивания
  class DraggingEvent {
    constructor(target = undefined) {
      this.target = target;
    }

    // Метод для добавления обработчика событий
    event(callback) {
      let handler;

      // Обработчик для мыши
      this.target.addEventListener("mousedown", e => {
        e.preventDefault(); // Предотвращаем стандартное поведение браузера

        handler = callback(e); // Вызываем колбэк и сохраняем его результат

        window.addEventListener("mousemove", handler); // Добавляем обработчик движения мыши

        document.addEventListener("mouseleave", clearDraggingEvent); // Добавляем обработчик покидания курсором области документа

        window.addEventListener("mouseup", clearDraggingEvent); // Добавляем обработчик отпускания кнопки мыши

        // Функция для очистки обработчиков событий
        function clearDraggingEvent() {
          window.removeEventListener("mousemove", handler); // Удаляем обработчик движения мыши
          window.removeEventListener("mouseup", clearDraggingEvent); // Удаляем обработчик отпускания кнопки мыши

          document.removeEventListener("mouseleave", clearDraggingEvent); // Удаляем обработчик покидания курсором области документа

          handler(null); // Вызываем колбэк с параметром null для завершения действия перетаскивания
        }
      });

      // Обработчик для сенсорных устройств
      this.target.addEventListener("touchstart", e => {
        handler = callback(e); // Вызываем колбэк и сохраняем его результат

        window.addEventListener("touchmove", handler); // Добавляем обработчик движения при касании

        window.addEventListener("touchend", clearDraggingEvent); // Добавляем обработчик отпускания пальца

        document.body.addEventListener("mouseleave", clearDraggingEvent); // Добавляем обработчик покидания курсором области документа

        // Функция для очистки обработчиков событий при сенсорном вводе
        function clearDraggingEvent() {
          window.removeEventListener("touchmove", handler); // Удаляем обработчик движения при касании
          window.removeEventListener("touchend", clearDraggingEvent); // Удаляем обработчик отпускания пальца

          handler(null); // Вызываем колбэк с параметром null для завершения действия перетаскивания
        }
      });
    }

    // Метод для получения расстояния, на которое был перемещен указатель
    getDistance(callback) {
      // Функция, инициализирующая начальные координаты
      function distanceInit(e1) {
        let startingX, startingY;

        // Определяем начальные координаты в зависимости от типа устройства
        if ("touches" in e1) {
          startingX = e1.touches[0].clientX;
          startingY = e1.touches[0].clientY;
        } else {
          startingX = e1.clientX;
          startingY = e1.clientY;
        }

        // Возвращаем функцию, вычисляющую расстояние от начальных координат до текущих
        return function(e2) {
          if (e2 === null) {
            return callback(null); // Если передан null, вызываем колбэк с null
          } else {
            // Вычисляем разницу координат и передаем ее в колбэк
            if ("touches" in e2) {
              return callback({
                x: e2.touches[0].clientX - startingX,
                y: e2.touches[0].clientY - startingY
              });
            } else {
              return callback({
                x: e2.clientX - startingX,
                y: e2.clientY - startingY
              });
            }
          }
        };
      }

      // Вызываем метод event с функцией distanceInit в качестве колбэка
      this.event(distanceInit);
    }
  }

  // Класс для карусели слайдов
  class CardCarousel extends DraggingEvent {
    constructor(container) {
      super(container); // Вызов конструктора DraggingEvent с передачей контейнера

      // DOM элементы
      this.container = container;
      this.cards = container.querySelectorAll(".slider-cards__slide");

      // Данные карусели
      this.centerIndex = (this.cards.length - 1) / 2; // Индекс центрального слайда
      this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100; // Ширина карточки в процентах от ширины контейнера
      this.xScale = {}; // Объект для отслеживания позиций слайдов

      // Обновление при изменении размеров окна
      window.addEventListener("resize", this.updateCardWidth.bind(this));

      // Инициализация карусели
      this.build();

      // Привязываем событие перетаскивания к методу moveCards
      super.getDistance(this.moveCards.bind(this));

      // Добавляем обработчики кликов на карточки
      this.cards.forEach(card => {
        card.addEventListener("click", (e) => {
          const cardIndex = parseInt(card.getAttribute("data-x"));
          if (cardIndex < 0) {
            this.moveNext(); // Переход к следующему слайду при клике на левую часть карточки
          } else if (cardIndex > 0) {
            this.movePrev(); // Переход к предыдущему слайду при клике на правую часть карточки
          }
        });
      });
    }

    // Метод для обновления ширины карточек при изменении размеров окна
    updateCardWidth() {
      this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100;
      this.build(); // Перестраиваем карусель с учетом новых размеров
    }

    // Метод для инициализации карусели
    build(fix = 0) {
      for (let i = 0; i < this.cards.length; i++) {
        const x = i - this.centerIndex; // Расстояние от центрального слайда
        const scale = this.calcScale(x); // Вычисляем масштаб слайда
        const scale2 = this.calcScale2(x); // Вычисляем второй масштаб слайда
        const zIndex = -(Math.abs(i - this.centerIndex)); // Вычисляем z-index слайда
        const leftPos = this.calcPos(x, scale2); // Вычисляем положение слайда

        this.xScale[x] = this.cards[i]; // Запоминаем слайд и его позицию

        // Обновляем стили слайда
        this.updateCards(this.cards[i], {
          x: x,
          scale: scale,
          leftPos: leftPos,
          zIndex: zIndex
        });
      }
    }

    // Метод для вычисления положения слайда
    calcPos(x, scale) {
      let formula;
      let gap; // Добавляем переменную для дополнительного расстояния в процентах

      if (window.innerWidth < 900) {
        gap = 24;
      } else {
        gap = 20;
      }

      if (x < 0) {
        formula = (scale * 100 - this.cardWidth) / 2 - gap;
        return formula;
      } else if (x > 0) {
        formula = 100 - (scale * 100 + this.cardWidth) / 2 + gap;
        return formula;
      } else {
        formula = 100 - (scale * 100 + this.cardWidth) / 2;
        return formula;
      }
    }


    // Метод для обновления стилей слайда
    updateCards(card, data) {
      if (data.x || data.x === 0) {
        card.setAttribute("data-x", data.x);
      }

      if (data.scale || data.scale === 0) {
        card.style.transform = `scale(${data.scale})`;

        if (data.scale === 0) {
          card.style.opacity = data.scale;
        } else {
          card.style.opacity = 1;
        }
      }

      if (data.leftPos) {
        card.style.left = `${data.leftPos}%`;
      }

      if (data.zIndex || data.zIndex === 0) {
        if (data.zIndex === 0) {
          card.classList.add("show");
        } else {
          card.classList.remove("show");
        }

        card.style.zIndex = data.zIndex;
      }
    }

    // Метод для вычисления первого масштаба слайда
    calcScale2(x) {
      let formula;

      if (x <= 0) {
        formula = 1 - -1 / 5 * x;
        return formula;
      } else if (x > 0) {
        formula = 1 - 1 / 5 * x;
        return formula;
      }
    }

    // Метод для вычисления второго масштаба слайда
    calcScale(x) {
      const formula = 1 - 1 / 5 * Math.pow(x, 2);
      if (formula <= 0) {
        return 0;
      } else {
        return formula;
      }
    }

    // Метод для проверки порядка слайдов
    checkOrdering(card, x, xDist) {
      const original = parseInt(card.dataset.x);
      const rounded = Math.round(xDist);
      let newX = x;

      if (x !== x + rounded) {
        if (x + rounded > original) {
          if (x + rounded > this.centerIndex) {
            newX = ((x + rounded - 1) - this.centerIndex) - rounded + -this.centerIndex;
          }
        } else if (x + rounded < original) {
          if (x + rounded < -this.centerIndex) {
            newX = ((x + rounded + 1) + this.centerIndex) - rounded + this.centerIndex;
          }
        }

        this.xScale[newX + rounded] = card;
      }

      const temp = -Math.abs(newX + rounded);

      this.updateCards(card, {
        zIndex: temp
      });

      return newX;
    }

    // Метод для перемещения слайдов
    moveCards(data) {
      let xDist;

      if (data !== null) {
        this.container.classList.remove("smooth-return");
        xDist = data.x / 250;
      } else {
        this.container.classList.add("smooth-return");
        xDist = 0;

        for (let x in this.xScale) {
          this.updateCards(this.xScale[x], {
            x: x,
            zIndex: Math.abs(Math.abs(x) - this.centerIndex)
          });
        }
      }

      for (let i = 0; i < this.cards.length; i++) {
        const x = this.checkOrdering(this.cards[i], parseInt(this.cards[i].dataset.x), xDist);
        const scale = this.calcScale(x + xDist);
        const scale2 = this.calcScale2(x + xDist);
        const leftPos = this.calcPos(x + xDist, scale2);

        this.updateCards(this.cards[i], {
          scale: scale,
          leftPos: leftPos
        });
      }
    }

    // Метод для перемещения к следующему слайду
    moveNext() {
      const temp = {
        ...this.xScale
      };

      for (let x in this.xScale) {
        const newX = parseInt(x) + 1 > this.centerIndex ? -this.centerIndex : parseInt(x) + 1;
        temp[newX] = this.xScale[x];
      }

      this.xScale = temp;

      for (let x in temp) {
        const scale = this.calcScale(x);
        const scale2 = this.calcScale2(x);
        const leftPos = this.calcPos(x, scale2);
        const zIndex = -Math.abs(x);

        this.updateCards(this.xScale[x], {
          x: x,
          scale: scale,
          leftPos: leftPos,
          zIndex: zIndex
        });
      }
    }

    // Метод для перемещения к предыдущему слайду
    movePrev() {
      const temp = {
        ...this.xScale
      };

      for (let x in this.xScale) {
        const newX = parseInt(x) - 1 < -this.centerIndex ? this.centerIndex : parseInt(x) - 1;
        temp[newX] = this.xScale[x];
      }

      this.xScale = temp;

      for (let x in temp) {
        const scale = this.calcScale(x);
        const scale2 = this.calcScale2(x);
        const leftPos = this.calcPos(x, scale2);
        const zIndex = -Math.abs(x);

        this.updateCards(this.xScale[x], {
          x: x,
          scale: scale,
          leftPos: leftPos,
          zIndex: zIndex
        });
      }
    }
  }

  // Инициализируем карусель
  const carousel = new CardCarousel(cardsContainer);
}