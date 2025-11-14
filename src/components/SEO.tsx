import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  canonical?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = 'https://images.unsplash.com/photo-1659596513612-23f9db4984aa?auto=format&fit=crop&w=1200',
  url,
  type = 'website',
  noindex = false,
  canonical,
}: SEOProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const fullUrl = url ? `${siteUrl}${url}` : `${siteUrl}${window.location.pathname}`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : fullUrl;
  const ogImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:url', fullUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'VELO Luxury', 'property');
    updateMetaTag('og:locale', 'en_US', 'property');
    updateMetaTag('og:locale:alternate', 'ar_SA', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Language alternates
    const currentPath = window.location.pathname;
    let langEn = document.querySelector('link[rel="alternate"][hreflang="en"]') as HTMLLinkElement;
    let langAr = document.querySelector('link[rel="alternate"][hreflang="ar"]') as HTMLLinkElement;

    if (!langEn) {
      langEn = document.createElement('link');
      langEn.setAttribute('rel', 'alternate');
      langEn.setAttribute('hreflang', 'en');
      document.head.appendChild(langEn);
    }
    langEn.setAttribute('href', `${siteUrl}${currentPath}`);

    if (!langAr) {
      langAr = document.createElement('link');
      langAr.setAttribute('rel', 'alternate');
      langAr.setAttribute('hreflang', 'ar');
      document.head.appendChild(langAr);
    }
    langAr.setAttribute('href', `${siteUrl}${currentPath}`);

    // Cleanup function
    return () => {
      // Note: We don't remove meta tags on unmount as they should persist
      // The component will update them on next mount
    };
  }, [title, description, keywords, ogImage, fullUrl, canonicalUrl, type, noindex, siteUrl]);

  return null;
}

