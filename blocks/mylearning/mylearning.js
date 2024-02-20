
import { getCookie, getLO,renderMarkupCard,renderMarkupCarosuel,renderMarkupList,pagination } from '../../scripts/libs.js';

export default function decorate(block) {
  // [...block.children].forEach((row) => {
  //   row.className = "slide";
  // });
  const catalog = document.getElementsByClassName('mylearning');
  const classmain = catalog[0].className.split(' ');
  const catalogueIDList = classmain.filter(
    (x) => x.indexOf("id-") > -1
  );
  var catalogueID = '';
  if (catalogueIDList && catalogueIDList[0]) {
    catalogueID = catalogueIDList[0].replace('id-', '');
  }
  var designLayoutType = classmain.filter(
    (x) => x.indexOf("lt-") > -1
  );
  var designLayout = '';
  if (designLayoutType && designLayoutType[0]) {
    designLayout = designLayoutType[0].replace('lt-', '');
  }
  console.log('qqqqq data1111  ', designLayout);
  console.log('qqqqq data  ', designLayout);
  getLO('',true).then(resposnse => {
    console.log('cataloge data ', resposnse)
    const parentEl = document.querySelector('.mylearning');
    if(designLayout=='list'){
      parentEl.classList.add("list_mylearning");   
      renderMarkupList(parentEl,resposnse.data, true);
    }else if(designLayout=='carousel'){
      parentEl.classList.add("carousel_main");   
      renderMarkupCarosuel(parentEl,resposnse.data, true);
      goToSlide(0);
     sleek();
    }else{
      parentEl.insertAdjacentHTML("afterend", `<div class="numList"></div>`);
      renderMarkupCard(parentEl,resposnse.data, true);
      // pagination();
    }
    
    // renderMarkup(resposnse.data, true);
    // goToSlide(0);
    // sleek();
  });
  // &filter.catalogIds=154422

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
 
}