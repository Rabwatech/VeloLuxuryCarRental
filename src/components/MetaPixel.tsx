import { useEffect } from 'react';

export function MetaPixel() {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) {
      console.warn('Meta Pixel ID not found. Set VITE_META_PIXEL_ID in your .env file.');
      return;
    }

    // Initialize Facebook Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    return () => {
      // Cleanup
      const pixelScript = document.querySelector('script[src*="connect.facebook.net"]');
      if (pixelScript) {
        pixelScript.remove();
      }
      const noscriptTag = document.querySelector('noscript');
      if (noscriptTag && noscriptTag.querySelector(`img[src*="facebook.com/tr"]`)) {
        noscriptTag.remove();
      }
    };
  }, [pixelId]);

  return null;
}

// Helper function to track custom events
export const trackMetaPixelEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data);
  }
};

// Common event tracking functions
export const trackPageView = () => trackMetaPixelEvent('PageView');
export const trackContactFormSubmit = () => trackMetaPixelEvent('Lead', { content_name: 'Contact Form' });
export const trackWhatsAppClick = (source?: string) => trackMetaPixelEvent('Contact', { content_name: `WhatsApp - ${source || 'Unknown'}` });
export const trackCarView = (carName: string) => trackMetaPixelEvent('ViewContent', { content_name: carName, content_category: 'Car Rental' });
export const trackFleetView = () => trackMetaPixelEvent('ViewContent', { content_name: 'Fleet Page', content_category: 'Car Rental' });
export const trackBookingInquiry = (carName: string) => trackMetaPixelEvent('InitiateCheckout', { content_name: carName, content_category: 'Car Rental' });

