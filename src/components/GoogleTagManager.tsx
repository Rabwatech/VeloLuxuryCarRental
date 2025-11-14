import { useEffect } from 'react';

export function GoogleTagManager() {
  const gtmId = import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID;

  useEffect(() => {
    if (!gtmId) {
      console.warn('Google Tag Manager ID not found. Set VITE_GOOGLE_TAG_MANAGER_ID in your .env file.');
      return;
    }

    // GTM script (noscript is handled in index.html)
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);

    return () => {
      // Cleanup: Remove GTM script on unmount (though typically we want it to persist)
      const gtmScript = document.querySelector(`script[src*="googletagmanager.com/gtm.js"]`);
      if (gtmScript) {
        gtmScript.remove();
      }
    };
  }, [gtmId]);

  return null;
}

// Helper function to push events to dataLayer
export const gtmPush = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...data,
    });
  }
};

