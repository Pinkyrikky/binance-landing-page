'use strict'

function shouldShowDisclaimerTopBar() {
  const TARGET_LNG = 'es'
  const TARGET_REGION = 'es'

  const { region = '', locale = '', disclaimerConfig = {} } = bnvelidate || {}
  const { enable = false } = disclaimerConfig

  return enable && region === TARGET_REGION && locale === TARGET_LNG
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function getUrl(url) {
  const arr = window.location.host.split('.')
  arr.shift()
  arr.unshift('www')
  const newHost = /localhost/.test(window.location.host) ? window.location.host : arr.join('.')
  return `https://${newHost}/${url}`
}

function getDisclaimer({ msg, redirectUrl, isOpenNewPage, btnText, prefixIconSvg }) {
  var linkWrapper
  var contentWrapper
  var prefixIconWrapper
  var msgEle
  var btnSuffixWrapper
  var btn
  var rightContent

  if (redirectUrl) {
    linkWrapper = document.createElement('a')
    linkWrapper.href = redirectUrl
    if (isOpenNewPage) {
      linkWrapper.target = '_blank'
    }
  }

  contentWrapper = document.createElement('div')
  contentWrapper.style.display = 'flex'
  contentWrapper.style.alignItems = 'start'
  contentWrapper.style.justifyContent = 'center'
  contentWrapper.style.maxWidth = '1200px'
  contentWrapper.style.margin = '0 auto'
  contentWrapper.style.fontSize = '14px'

  rightContent = document.createElement('div')
  rightContent.style.margin = '0 8px 0 8px'

  if (prefixIconSvg) {
    prefixIconWrapper = document.createElement('div')
    prefixIconWrapper.innerHTML = prefixIconSvg
  }

  msgEle = document.createElement('div')
  msgEle.innerText = msg
  msgEle.style.color = '#EAECEF'
  msgEle.style.fontSize = '14px'
  msgEle.style.lineHeight = '20px'

  if (btnText) {
    btn = document.createElement('span')
    btn.innerText = btnText
    btn.style.color = '#F0B90B'
    btn.style.lineHeight = '20px'
    btn.style.marginLeft = '4px'

    msgEle.appendChild(btn)
  }

  rightContent.appendChild(msgEle)

  if (prefixIconWrapper) contentWrapper.appendChild(prefixIconWrapper)
  contentWrapper.appendChild(rightContent)
  if (btnSuffixWrapper) contentWrapper.appendChild(btnSuffixWrapper)

  if (linkWrapper) {
    linkWrapper.appendChild(contentWrapper)
    return linkWrapper
  } else {
    return contentWrapper
  }
}

function createSticky(config) {
  var topBar
  var contentEle = getDisclaimer(config)

  topBar = document.createElement('div')
  topBar.style.width = '100%'
  topBar.style.boxSizing = 'border-box'
  topBar.style.padding = '12px 16px'
  topBar.style.backgroundColor = '#2B3139'
  topBar.style.position = 'sticky'
  topBar.style.top = '0px'
  topBar.style.zIndex = '9999'

  topBar.appendChild(contentEle)

  var appEle = document.getElementById('__APP')

  if (appEle) {
    var appChild = appEle.childNodes[0]
    appEle.insertBefore(topBar, appChild)
  }
}

function disclaimerTopBar() {
  const dataConfig = {
    msg: 'La inversión en criptoactivos no está regulada, puede no ser adecuada para inversores minoristas y perderse la totalidad del importe invertido. Es importante leer y comprender los riesgos de esta inversión que se explican detalladamente',
    btnText: 'en esta ubicación.',
    redirectUrl: getUrl('es/support/faq/1f045f3170254817ad9226a3a0f2f42e'),
    isOpenNewPage: true,
  }
  window._getDisclaimer = getDisclaimer
  if (shouldShowDisclaimerTopBar()) {
    createSticky(dataConfig)
  }
}

function checkIsAeUser(region = '', isLoggedIn) {
  return isLoggedIn ? getCookie('BNC-Location') === 'AE' : region.toLowerCase() === 'ae'
}

function handleAeRedirect(region, isLoggedIn) {
  const isAe = checkIsAeUser(region, isLoggedIn)
  if (!isAe) return
  const { locale = '' } = bnvelidate || {}
  if (locale !== 'en-DB') {
    window.location.href = getUrl('en-DB?aeDialogShow=show')
  }
}

; (function () {
  disclaimerTopBar()
  const { isLoading } = bnvelidate || {}
  const isSupportLogin = typeof isLoading === 'boolean' && localStorage.getItem('AE_REDIRECT') === '1'

  if (isSupportLogin) {
    let commonJsTimer = setInterval(() => {
      if (!bnvelidate.isLoading) {
        main()
        clearInterval(commonJsTimer)
      }
    }, 100)
  }
})()


function main() {
  const { region, isLoggedIn } = bnvelidate || {}
  handleAeRedirect(region, isLoggedIn)
}
