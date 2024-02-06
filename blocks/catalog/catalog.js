export default function decorate(block) {
  // [...block.children].forEach((row) => {
  //   row.className = "slide";
  // });
  function getCookie() {
    let name = "access_token" + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${getCookie()}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    "https://captivateprime.adobe.com/primeapi/v2/learningObjects?page[limit]=10&filter.loTypes=course&sort=name&filter.ignoreEnhancedLP=true",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result.data);
      renderMarkup(result.data, true);
      goToSlide(0);
      sleek();
    })
    .catch((error) => console.log("error", error));
  const renderMarkup = function (result, value) {
    const markup = generateMarkuploop();
    const parentEl = document.querySelector(".carouselapi");
    parentEl.innerHTML = "";
    parentEl.insertAdjacentHTML("afterbegin", markup);
    parentEl.insertAdjacentHTML(
      "beforeend",
      `<button id="leftbutton" class="slider__btn slider__btn--left">&larr;</button>`
    );

    parentEl.insertAdjacentHTML(
      "beforeend",
      `<button id="rightbutton" class="slider__btn slider__btn--right">&rarr;</button>`
    );

    function generateMarkuploop() {
      const Mark = result.map((res) => generateMarkup(res)).join("");
      return Mark;
    }
    function generateMarkup(result) {
      return `<div class="slideapi">
      <div>
    <picture><source  srcset="${result.attributes.imageUrl}" alt="" ><img loading="lazy" src="${result.attributes.imageUrl}"></picture>
    <div class="img-txt">${result.attributes.localizedMetadata[0].name}</div>
    </div>
    </div>`;
    }
    return markup;
    // <div class="img-txt-products"><span>${result.attributes.localizedMetadata[0].name}</span>
  };
  // const slider = document.querySelector(".carouselapi");
  // let currentSlide = 0;

  // const slides = document.querySelectorAll(".slideapi");
  function goToSlide(slide) {
    const slides = document.querySelectorAll(".slideapi");
    const totalSlide = slides.length;
    console.log("slides" + totalSlide);
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  }
  function sleek() {
    let currentSlide = 0;
    // const parentEl = document.querySelector(".carouselapi");
    const rightbutton = document.getElementById("rightbutton");
    const leftbutton = document.getElementById("leftbutton");
    rightbutton.addEventListener("click", clickrightButton);
    leftbutton.addEventListener("click", clickLeftButton);

    function clickrightButton() {
      console.log("click right");
      // console.log(slide);
      const slides = document.querySelectorAll(".slideapi");
      const totalSlide = slides.length;
      if (currentSlide == totalSlide - 1) {
        currentSlide = 0;
      } else {
        currentSlide++;
      }
      goToSlide(currentSlide);
    }
    function clickLeftButton() {
      const slides = document.querySelectorAll(".slideapi");
      const totalSlide = slides.length;
      if (currentSlide == 0) {
        currentSlide = totalSlide - 1;
      } else {
        currentSlide--;
      }
      goToSlide(currentSlide);
    }
  }
  // const totalSlide = slides.length;
  // console.log("slides" + totalSlide);
  // function goToSlide(slide) {
  //   slides.forEach((s, i) => {
  //     s.style.transform = `translateX(${100 * (i - slide)}%)`;
  //   });
  // }
  // const goToSlide = function (slide) {
  //   slides.forEach((s, i) => {
  //     s.style.transform = `translateX(${100 * (i - slide)}%)`;
  //   });
  // };
}