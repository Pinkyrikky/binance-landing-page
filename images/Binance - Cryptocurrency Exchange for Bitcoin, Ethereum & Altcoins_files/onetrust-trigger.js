const checkOtAttr = (event) => {
  const path = event.path || (event.composedPath && event.composedPath());

  return !!path.find((el) => {
    if (el.id === "footer_menu_item_ba-one-trust-cookie") {
      return true;
    }
    if (el && el.getAttribute) {
      return el.getAttribute("data-ot-trigger") === "true";
    }
    return false;
  });
};

let lang = location.pathname.match(/[^/?]+/);
lang = lang ? lang[0] : "en";

document.addEventListener("click", (event) => {
  if (checkOtAttr(event)) {
    if (!window.OneTrust) {
      console.error("please load oneTrust chunk first");
    } else {
      window.OneTrust.ToggleInfoDisplay();
    }

    event.preventDefault();
  }

  if (event.target.classList.contains("privacy-notice-link")) {
    if (lang === "en-NZ") {
      event.preventDefault();
      location.href = `https://www.${location.origin.split('.').slice('-2').join('.')}/${lang}/cookie-privacy`;
    }
  }
});

window.addEventListener("DOMContentLoaded", (event) => {
  const sy = document.createElement("style");
  sy.innerHTML = `#ot-sdk-btn-floating {
    display: none;
}`;
  document.body.append(sy);
});

// match OptanonConsent cookie
window.addEventListener("load", (event) => {
  const catchValue = (str, reg) => {
    const result = str.match(reg);
    return result ? result[1] : null;
  };

  let OptanonConsent = catchValue(document.cookie, /OptanonConsent=([^;]*)/);
  const domain = catchValue(window.location.hostname, /\w+(\.\w+\.\w+)$/);
  try {
    OneTrust && OneTrust.changeLanguage(lang)
  } catch (error) {
    console.log(error)
  }
  

  const getNextYear = (date) =>
    new Date(date.setFullYear(date.getFullYear() + 1)).toGMTString();
  if (OptanonConsent) {
    let dateStamp = catchValue(OptanonConsent, /datestamp=([^&]*)/);
    let date = null;
    if (dateStamp) {
      dateStamp = dateStamp ? decodeURIComponent(dateStamp) : null;

      dateStamp = dateStamp.replace(/\+/g, " ");

      dateStamp = dateStamp.replace(/GMT\s/g, "GMT+");

      date = getNextYear(new Date(dateStamp));
    }

    document.cookie = `OptanonConsent=${OptanonConsent};path=/;domain=${domain};expires=${date};priority=high;`;
  }

  const OptanonAlertBoxClosed = catchValue(
    document.cookie,
    /OptanonAlertBoxClosed=([^;]*)/
  );

  if (OptanonAlertBoxClosed) {
    const date = getNextYear(new Date(OptanonAlertBoxClosed));

    document.cookie = `OptanonAlertBoxClosed=${OptanonAlertBoxClosed};path=/;domain=${domain};expires=${date};priority=high;`;
  }
});
