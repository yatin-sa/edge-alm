
import { getCookie, getLOData, getLOEnrollmentData, enrollUser, renderMarkupCarosuel, renderMarkupList, pagination } from '../../scripts/libs.js';
import { configALM } from "../../config.js"
var url = new URL(document.URL);
var lo_id = url.searchParams.get("lo");
console.log(lo_id, 'main url');


export default function decorate(block) {
  // [...block.children].forEach((row) => {
  //   row.className = "slide";
  // });
  

  getLOData(lo_id).then(response => {
    getLOEnrollmentData(lo_id).then(enrollRes => {
      console.log('cataloge data ', enrollRes)
      
      var isEnroll = (enrollRes && enrollRes?.included && enrollRes?.included[0]?.attributes && enrollRes?.included[0]?.attributes?.state) ? true : false;
      

    const LoInsarray = response.included.filter((x) => x.type === "learningObjectInstance" && x.attributes.isDefault);
    var  rightColMarkup = rightCol(enrollRes,response.data.id,isEnroll,LoInsarray[0].id);

    const copy1 = response.included.filter((x) => x.type === "learningObjectResource");
    const loResource = copy1.filter((x) => {
      return LoInsarray[0].relationships.loResources.data.some((f) => {
        return f.id === x.id;
      });
    });
    const resid = LoInsarray[0].relationships.loResources.data.map((el) => el.id + "_resource");
    const rescopy1 = response.included.filter((x) => x.type === "resource");
    const resource = rescopy1.filter((x) => {
      return (
        (x.attributes.contentType !== "Classroom" &&
          x.attributes.contentType !== "Virtual Classroom") ||
        resid.includes(x.id)
      );
    });
    console.log('main resouce', resource)

    const parentEl = document.querySelector('.lopage');
    const bannerMarkup = banner(response);
    const modulesMarkup = modules(resource, response.data.id,isEnroll,LoInsarray[0].id);
    
    
    const courseTabs = '<div class="mt-3 card p-3"><ul class="nav nav-tabs" id="courseTab"><li class="nav-item"><button class="nav-link active"  data-bs-toggle="tab" data-bs-target="#moduleTab" type="button">Modules</button></li><li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#overviewTab" type="button">Overview</button></li></ul><div class="tab-content" id="courseTabContent"><div class="tab-pane fade show active pt-4" id="moduleTab">' + modulesMarkup + '</div><div class="tab-pane fade pt-4" id="overviewTab">' + response?.data?.attributes?.localizedMetadata[0].description + '</div></div></div>'

    parentEl.insertAdjacentHTML("afterbegin", bannerMarkup + '<div class="container-fluid"><div class="row"><div class="col-9">' + courseTabs + '</div><div class="col-3">' + rightColMarkup + '</div></div></div>');
    handleContinueClick();
  });
  });

}

function banner(resp) {
  var banner = resp?.data?.attributes?.bannerUrl;
  if (banner) {
    return '<div class="lo_cover" style="background-image: url(&quot;' + banner + '&quot;);"><h2>' + resp?.data?.attributes?.localizedMetadata[0].name + '</h2><p>' + resp?.data?.attributes?.enrollmentType + '</p></div>'
  } else {
    return '<div class="lo_cover"><h2>' + resp?.data?.attributes?.localizedMetadata[0].name + '</h2><p class="badge">' + resp?.data?.attributes?.enrollmentType + '</p></div>'
  }

}

function modules(resp, loId,isEnroll,instance) {
  var content = '';
  var moduleItem = '';
  resp.map(function (val, ind) {
    if (val.attributes.contentType === "Classroom") {
      moduleItem = moduleItem + '<li instance="' + instance + '" enroll="'+isEnroll+'" loid="' + loId + '" module="' + val.id + '" class="handlelo"><img src="../../icons/play-circle-fill.svg" /><div class=""><h2>' + val.attributes.name + '</h2><p><span class="float-start">' + val.attributes.contentType + '</span><span  class="float-end">' + getTime(val.attributes.desiredDuration) + '<span></p></div></li>';
      moduleItem = (resp.length <= ind) ? moduleItem + '<hr />' : moduleItem;
    } else if (val.attributes.contentType === "Virtual Classroom") {
      moduleItem = moduleItem + '<li instance="' + instance + '" enroll="'+isEnroll+'" loid="' + loId + '" module="' + val.id + '" class="handlelo"><img src="../../icons/play-circle-fill.svg" /><div class=""><h2>' + val.attributes.name + '</h2><p><span class="float-start">' + val.attributes.contentType + '</span><span  class="float-end">' + getTime(val.attributes.desiredDuration) + '<span></p></div></li>';
      moduleItem = (resp.length <= ind) ? moduleItem + '<hr />' : moduleItem;
    } else {
      moduleItem = moduleItem + '<li instance="' + instance + '" enroll="'+isEnroll+'" loid="' + loId + '" module="' + val.id + '" class="handlelo"><img src="../../icons/play-circle-fill.svg" /><div class=""><h2>' + val.attributes.name + '</h2><p><span class="float-start">' + val.attributes.contentType + '</span><span  class="float-end">' + getTime(val.attributes.desiredDuration) + '<span></p></div></li>';
      moduleItem = (resp.length <= ind) ? moduleItem + '<hr />' : moduleItem;
      console.log('mod  ', moduleItem)
    }
  })
  content = '<ul class="main_modules mb-5 card p-2 shadow-sm">' + moduleItem + '</ul>';
  return content;
}
function rightCol(resp, loId,isEnroll,instance) {
  var content = '';
  console.log('sasasas ',getLabel(resp));
  content = '<div class="mt-4"><button instance="' + instance + '" enroll="'+isEnroll+'" type="button" loid="' + loId + '" class="handlelo main_enroll_btn btn btn-outline-light btn-lg">'+getLabel(resp)+'</button></div>';
  return content;
}

function handleContinueClick() {
  [...document.querySelectorAll('.handlelo')].forEach(function (item) {
    item.addEventListener("click", (e) => {
      
      if(item.getAttribute('enroll') == 'true'){
        playerHelp(item);
      }else{
        enrollUser(item.getAttribute('loid'),item.getAttribute('instance')).then(response => {
          if(response?.data?.id){
            playerHelp(item);
          }
          
        });
      }
      
    });

  });

};

function playerHelp(item){
  var playerUrl = '';
  if(item.getAttribute('module')){
    playerUrl = 'https://learningmanager.adobe.com/app/player?lo_id=' + item.getAttribute('loid') + '&access_token=' + getCookie() + '&module_id=' + item.getAttribute('module');
  }else{
    playerUrl = 'https://learningmanager.adobe.com/app/player?lo_id=' + item.getAttribute('loid') + '&access_token=' + getCookie();
  }
  

  const parentEl = document.querySelector('.lopage');
  parentEl.insertAdjacentHTML("afterbegin", '<div style="height: 100vh;width: 100%"><iframe src="' + playerUrl + '" height="100%" width="100%"></iframe></div>');
  window.addEventListener("message", function closePlayer() {
    if (event.data === "status:close") {
      var referrer = document.referrer;
      console.log('ijijij', referrer);
      if (referrer) {
        window.location.href = referrer;
      }
    }
  });
}

function getTime(secs) {
  if (secs >= 60) {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    if (seconds !== 0) {
      return mins + " mins " + seconds + " seconds";
    } else return mins + " mins ";
  } else return secs + " seconds";
};

function getLabel(inp) {

  if (inp && inp?.included) {
    switch (inp?.included[0]?.attributes?.state) {
      case "ENROLLED":
        return "START";
      case "STARTED":
        return "CONTINUE";
      case "COMPLETED":
        return "REVISIT";
    }
  }  else {
    return "Start Learning Now";
  }
};