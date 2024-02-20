import {configALM} from "../config.js"

export function getCookie() {
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

export function getLO(catalog,isLearning = false) {
    var resp = [];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getCookie()}`);
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };
    console.log('jijijijijiji ',configALM().APIURL)
    var loURL = configALM().APIURL+((isLearning) ? "learningObjects?page[limit]=10&filter.learnerState=enrolled,completed,started&sort=name&filter.ignoreEnhancedLP=true" : "learningObjects?page[limit]=10&filter.catalogIds="+catalog+"&sort=name&filter.ignoreEnhancedLP=true");
    return fetch(loURL, requestOptions)
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            return result;
        }, (error) => {
            error = error;
        })

}



export function renderMarkupCarosuel(parentEl, result, value) {
    const markup = generateMarkuploop();
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
      <div class="img-txt"><a href="overview?lo=${result.id}">${result.attributes.localizedMetadata[0].name}</a></div>
      </div>
      </div>`;
      }
    return markup;
};

export function renderMarkupCard(parentEl, result, value) {
    const markup = generateMarkuploop();
    parentEl.innerHTML = "";
    parentEl.insertAdjacentHTML("afterbegin", '<ul>'+markup+'</ul>');

    function generateMarkuploop() {
        const Mark = result.map((res) => generateMarkup(res)).join("");
        return Mark;
    }
    function generateMarkup(result) {
        if(result.attributes.imageUrl){
            return `<li class="card-item dis" id="${result.attributes.localizedMetadata[0].overview}">
            <div class="cards-card-image"><img class="products-img" src="${result.attributes.imageUrl}" alt="" /></div>
            <div class="cards-card-body"><h5><strong><a href="overview?lo=${result.id}">${result.attributes.localizedMetadata[0].name}</a></strong></h5></div>
        </li>`;
        }
        
    }
    return markup;
};

export function renderMarkupList(parentEl, result, value) {
    const markup = generateMarkuploop();
    parentEl.innerHTML = "";
    parentEl.insertAdjacentHTML("afterbegin", '<ul>'+markup+'</ul>');

    function generateMarkuploop() {
        const Mark = result.map((res) => generateMarkup(res)).join("");
        return Mark;
    }
    function generateMarkup(result) {
        if(result.attributes.imageUrl){
            return `<li class="item" id="${result.attributes.localizedMetadata[0].overview}">
            
            <div class="item-image"><img src="${result.attributes.imageUrl}" alt="" /></div>
            <div class="item-body"><h5 class="item-title"><strong><a href="overview?lo=${result.id}">${result.attributes.localizedMetadata[0].name}</a></strong></h5>
            <p class="item-text">${result.attributes.localizedMetadata[0].overview}</p>
            </div>
                      
        </li>`;
        }
        
    }
    return markup;
};


export function pagination() {
    const pagEl = document.querySelector(".numList");
    const courseList = document.querySelectorAll(".card-item");
    let num1 = courseList.length;
    let onepage = Math.ceil(num1 / 3);
    console.log(onepage,'paginationm');
    pagEl.innerHTML = "";
    for (let i = onepage; i > 0; i--) {
        pagEl.insertAdjacentHTML("afterbegin", `<span class="pageNum">${i}</span>`);
    }
    const pagBtn = document.querySelectorAll(".pageNum");
    for (let j = 0; j < 3; j++) {
        courseList[j].classList.remove("dis");
    }
    pagBtn.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
            console.log('asasasas');
            let currentval = Number(btn.textContent);
            for (let i = 0; i < courseList.length; i++) {
                courseList[i].classList.add("dis");
            }
            for (
                let j = 0 + (currentval - 1) * 3;
                j < 3 * (currentval - 1 + 1);
                j++
            ) {
                courseList[j].classList.remove("dis");
            }
        });
    });
}

export function getLOData(id) {
    var resp = [];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getCookie()}`);
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(configALM().APIURL+
        "learningObjects/"+id+"?page[limit]=10&filter.loTypes=course&sort=name&filter.ignoreEnhancedLP=true&include=instances.loResources.resources",
        requestOptions
    )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            return result;
        }, (error) => {
            error = error;
        })

}

export function getLOEnrollmentData(id) {
    var resp = [];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getCookie()}`);
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(configALM().APIURL+
        "learningObjects/"+id+"?page[limit]=10&filter.loTypes=course&sort=name&filter.ignoreEnhancedLP=true&include=enrollment",
        requestOptions
    )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            return result;
        }, (error) => {
            error = error;
        })

}


export function enrollUser(id,instance) {
    var resp = [];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getCookie()}`);
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(configALM().APIURL+
        "enrollments?loId="+id+"&loInstanceId="+instance,
        requestOptions
    )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            return result;
        }, (error) => {
            error = error;
        })

}




export function getDate(dateStart, dateEnd){
    const startdate = new Date(dateStart);
    const enddate = new Date(dateEnd);
    const month_num = startdate.getMonth();
    let month = "";
    switch (month_num) {
      case 0:
        month = "January";
        break;
      case 1:
        month = "February";
        break;
      case 2:
        month = "March";
        break;
      case 3:
        month = "April";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "June";
        break;
      case 6:
        month = "July";
        break;
      case 7:
        month = "August";
        break;
      case 8:
        month = "September";
        break;
      case 9:
        month = "October";
        break;
      case 10:
        month = "November";
        break;
      case 11:
        month = "December";
        break;
    }

    const day = startdate.getDate();
    const year = startdate.getFullYear();

    let shours = startdate.getHours();
    const sminutes =
      startdate.getMinutes() == 0 ? "00" : startdate.getMinutes();

    const ehours = enddate.getHours();
    const eminutes = enddate.getMinutes() == 0 ? "00" : enddate.getMinutes();

    return (
      month +
      " " +
      day +
      "," +
      year +
      " (" +
      shours +
      ":" +
      sminutes +
      "-" +
      ehours +
      ":" +
      eminutes +
      " )"
    );
  };