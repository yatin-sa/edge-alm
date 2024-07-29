import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
const API_CLIENT_ID = 'fbe5e04a-dd1e-412f-8945-e599a7a74166'
const API_CLIENT_SECRET = '5fe3b3f3-e316-4b4c-9625-809bcfc9e848'
//const API_REFRESH_TOKEN = '8d9bca948a0be41dc4524152e1444b52'
const REACT_APP_URL='https://main--edge-alm--yatin-sa.hlx.page'
// const REACT_APP_URL='http://localhost:3000'
const REACT_APP_ALM_URL='https://learningmanager.adobe.com'


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
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  console.log('header blocj ',block)
  // load nav as fragment
  function getCpOauthUrl() {

    document.location.href =
    REACT_APP_ALM_URL+"/oauth/o/authorize?client_id="+API_CLIENT_ID+"&redirect_uri="+REACT_APP_URL+"&state=cpState&scope=learner:read,learner:write&response_type=CODE&client_identifier=aemsite";
  }
  function setLogout() {
    document.cookie = "access_token" + "=" + ("");
    location.reload();
  }
  
  async function fetchToken(code) {
    if (code) {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      fetch(
        `https://learningmanager.adobe.com/oauth/token?client_id=fbe5e04a-dd1e-412f-8945-e599a7a74166&client_secret=5fe3b3f3-e316-4b4c-9625-809bcfc9e848&refresh_token=8d9bca948a0be41dc4524152e1444b52&code=${code}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          document.cookie = "access_token" + "=" + (result.access_token || "");
          document.location.href =REACT_APP_URL;
        })
        .catch((error) => console.log("error", error));
    }

  }
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  Window.onload = handlePrimeLogIn();

  async function handlePrimeLogIn() {
    console.log("handlePrimeLogIn");
    // const isLoggedIn = this.isLoggedIn();
    const currentUrl = new URL(window.location.href);
    const code = currentUrl.searchParams.get("code");
    if (code) {
      console.log("inside oauthcode");
      await fetchToken(code);
    } else {
      console.log("hello");
      if (getCookie() == "") {
        const markup = document.createElement("button");
        markup.setAttribute("id", "myButton");
        markup.innerHTML = "LOG IN";
        markup.classList.add("btn");
        markup.classList.add("btn-outline-light");
        markup.addEventListener("click", () => getCpOauthUrl());
        nav.append(markup);
      }else{
        const markup = document.createElement("button");
        markup.setAttribute("id", "myButton");
        markup.classList.add("btn");
        markup.classList.add("btn-outline-light");
        markup.innerHTML = "LOG OUT";
        markup.addEventListener("click", () => setLogout());
        nav.append(markup);
      }
    }
    //document.getElementById("myButton").onclick = getCpOauthUrl;
  }
  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
