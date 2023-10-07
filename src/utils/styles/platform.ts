import UAParser from 'ua-parser-js';

interface Browser {
  os: string;
  browser: string;
  recommendedMinVersion: number;
  minVersion?: number;
}

export const ALLOWED_BROWSERS: Record<'desktop' | 'mobile', Browser[]> = {
  desktop: [
    { os: '', browser: 'Firefox', recommendedMinVersion: 89 },
    { os: '', browser: 'Safari', recommendedMinVersion: 12, minVersion: 10 },
    { os: '', browser: 'Edge', recommendedMinVersion: 90 },
    { os: '', browser: 'Chrome', recommendedMinVersion: 90 },
  ],
  mobile: [
    { os: 'Android', browser: 'Chrome', recommendedMinVersion: 0 },
    { os: 'iOS', browser: 'Safari', recommendedMinVersion: 0 },
    { os: 'Mac OS', browser: 'Safari', recommendedMinVersion: 0 },
  ],
};

const SHOULD_WARN_UNSUPPORTED_MOBILE_BROWSER = true;

export const isBrowser = () => typeof window !== 'undefined';
export const UA = new UAParser();
const { name, version } = UA.getBrowser();
export const { device, os } = UA.getResult();
const getUA = () =>
  isBrowser() ? navigator.userAgent || navigator.vendor : '';

export const isTouchDevice = () =>
  isBrowser() &&
  ('ontouchstart' in window ||
    'ontouchstart' in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator['MaxTouchPoints'] > 0 ||
    navigator['msMaxTouchPoints'] > 0);

const UNDETECTED_TABLETS = [{ name: 'SHT-W09' }];

const isUndetectedTablets = () =>
  !!UNDETECTED_TABLETS.find(item => getUA().includes(item.name));

// Browsers
export const isSafari = () =>
  isBrowser() && name.toLowerCase().indexOf('safari') > -1;
export const isOpera = () =>
  isBrowser() && name.toLowerCase().indexOf('opera') > -1;
export const isFirefox = () =>
  isBrowser() && name.toLowerCase().indexOf('firefox') > -1;
export const isIE = () => isBrowser() && name.indexOf('IE') > -1;
export const isEdge = () =>
  isBrowser() && (name.indexOf('Edge') > -1 || /.*EdgA*/.test(getUA()));
export const isChrome = () => isBrowser() && name.indexOf('Chrome') > -1;
export const isFacebook = () =>
  isBrowser() && (getUA().indexOf('FBAN') > -1 || getUA().indexOf('FBAV') > -1);
export const isInstagram = () =>
  isBrowser() && getUA().indexOf('Instagram') > -1;
export const isTwitter = () => isBrowser() && getUA().indexOf('Twitter') > -1;

export const isIOS = () => os.name === 'iOS';
export const isAndroid = () => os.name === 'Android';
// As of Safari iOS 13, iPads and iPhones return UA strings identical to Mac OS, instead of iOS
export const isRecentIPadSafari = () =>
  isTouchDevice() && isSafari() && !isIOS() && window.devicePixelRatio === 2;
export const isRecentIPhoneSafari = () =>
  isTouchDevice() && isSafari() && !isIOS() && window.devicePixelRatio === 3;
export const isMobile = () =>
  device.type === 'mobile' || isRecentIPhoneSafari();
export const isTablet = () =>
  device.type === 'tablet' || isRecentIPadSafari() || isUndetectedTablets();
export const isAppleTablet = () =>
  (isTablet() && isIOS()) || isRecentIPadSafari();
export const isAppleMobile = () =>
  (isMobile() && isIOS()) || isRecentIPhoneSafari();
export const isDesktop = () => !isMobile() && !isTablet();
export const isRecentOS = () =>
  (isAndroid() && parseFloat(os.version) >= 9) ||
  (isIOS() && parseFloat(os.version) >= 13) ||
  isRecentIPadSafari();

export const isSocialBrowser = () =>
  isFacebook() || isInstagram() || isTwitter();

export const isStorybook = () =>
  isBrowser() &&
  window.location.pathname === '/iframe.html' &&
  window.location.port === '6006';

export const isSupportedBrowser = () => {
  let isSupported = false;
  let fromSocial = false;
  let needsUpgrade = false;

  if (!isBrowser() || !UA) {
    return { isSupported, fromSocial, needsUpgrade };
  }

  const allowedBrowsers = ALLOWED_BROWSERS[isDesktop() ? 'desktop' : 'mobile'];

  const supportedBrowser = allowedBrowsers.find(
    item => name.match(item.browser) && (item.os ? item.os === os.name : true)
  );

  if (supportedBrowser) {
    isSupported = true;
  }

  // If the browser version is slighlty outdated, accept it but warn the user
  if (
    supportedBrowser &&
    parseFloat(version) < supportedBrowser.recommendedMinVersion
  ) {
    needsUpgrade = true;
  }

  // If this is a non-standard mobile browser, accept it but warn the user
  // Can be tweaked if this isn't the desired behaviour for the project
  if (
    !supportedBrowser &&
    !isDesktop() &&
    SHOULD_WARN_UNSUPPORTED_MOBILE_BROWSER
  ) {
    needsUpgrade = true;
    isSupported = true;
  }

  // If the browser is too old, refuse it
  if (
    supportedBrowser &&
    supportedBrowser.minVersion &&
    parseFloat(version) < supportedBrowser.minVersion
  ) {
    needsUpgrade = true;
    isSupported = false;
  }

  // If this is a social browser, refuse it
  if (isSocialBrowser()) {
    needsUpgrade = false;
    fromSocial = true;
    isSupported = false;
  }

  return { isSupported, fromSocial, needsUpgrade };
};

export const hasWebGl = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(isBrowser() && gl && gl instanceof WebGLRenderingContext);
  } catch (e) {
    return null;
  }
};

export const isLandscape = () =>
  isBrowser()
    ? isDesktop()
      ? window.innerWidth > window.innerHeight
      : Math.abs(
          (window.screen.orientation?.angle ?? window.orientation) % 180
        ) !== 0
    : true;

export const isInputFocused = () =>
  isBrowser() && document.activeElement
    ? document.activeElement.tagName.toLowerCase() === 'input' ||
      document.activeElement.tagName.toLowerCase() === 'textfield' ||
      document.activeElement.tagName.toLowerCase() === 'select'
    : false;

export const hasURLBar = () => {
  if (!isBrowser()) return false;

  const bodyHeight = Math.round(document.body.getBoundingClientRect().height);
  const htmlHeight = Math.round(
    document.querySelector('html').getBoundingClientRect().height
  );
  // Safari uses the device's width regardless of current orientation
  const screenHeight =
    isSafari() && isLandscape() ? window.screen.width : window.screen.height;

  return isSafari()
    ? bodyHeight !== screenHeight
    : window.innerHeight < htmlHeight;
};

export const documentZoom = () =>
  isBrowser() ? document.body.clientWidth / window.innerWidth : 1;

// low performance devices
export const isGalaxyTab = () => ['SM-T825'].includes(device.model);
export const isLowPerformanceIpad = () =>
  isAppleTablet() &&
  window.screen.width === 768 &&
  window.screen.height === 1024;
export const isLowPerformanceIphone = () => {
  if (
    window.screen.height / window.screen.width === 667 / 375 &&
    window.devicePixelRatio === 2 &&
    isIOS()
  ) {
    return true; // "iPhone 6, 6s, 7 or 8";
  }
  // iPhone 5/5C/5s/SE or 6/6s/7 and 8 in zoom mode
  else if (
    window.screen.height / window.screen.width === 1.775 &&
    window.devicePixelRatio === 2 &&
    isIOS()
  ) {
    return true; // "iPhone 5, 5C, 5S, SE or 6, 6s, 7 and 8 (display zoom)";
  }
  // iPhone 4/4s
  else if (
    window.screen.height / window.screen.width === 1.5 &&
    window.devicePixelRatio === 2 &&
    isIOS()
  ) {
    return true; // "iPhone 4 or 4s";
  }
  // iPhone 1/3G/3GS
  else if (
    window.screen.height / window.screen.width === 1.5 &&
    window.devicePixelRatio === 1 &&
    isIOS()
  ) {
    return true; // "iPhone 1, 3G or 3GS";
  } else {
    return false;
  }
};
