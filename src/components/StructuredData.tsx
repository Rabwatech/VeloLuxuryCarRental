import { useEffect } from 'react';

interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  image?: string;
  '@id'?: string;
  url?: string;
  telephone?: string;
  priceRange?: string;
  address?: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    '@type': string;
    latitude: string;
    longitude: string;
  };
  openingHoursSpecification?: Array<{
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  areaServed?: {
    '@type': string;
    name: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url?: string;
  logo?: string;
  contactPoint?: {
    '@type': string;
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  sameAs?: string[];
}

interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image?: string | string[];
  brand?: {
    '@type': string;
    name: string;
  };
  offers?: {
    '@type': string;
    priceCurrency: string;
    price: string;
    availability: string;
    url?: string;
  };
  category?: string;
}

interface ServiceSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider?: {
    '@type': string;
    name: string;
  };
  areaServed?: {
    '@type': string;
    name: string;
  };
  serviceType?: string;
}

interface FAQPageSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Organization' | 'Product' | 'Service' | 'FAQPage';
  data: LocalBusinessSchema | OrganizationSchema | ProductSchema | ServiceSchema | FAQPageSchema;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const scriptId = `structured-data-${type.toLowerCase()}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}

// Helper functions to create common schemas
export const createLocalBusinessSchema = (): LocalBusinessSchema => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://veloluxury.my/#organization',
  name: 'VELO Luxury',
  url: 'https://veloluxury.my',
  image: 'https://veloluxury.my/logo.png',
  telephone: '+60123456789',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3 Towers Ampang, Jalan Ampang',
    addressLocality: 'Kuala Lumpur',
    addressRegion: 'Wilayah Persekutuan',
    postalCode: '50450',
    addressCountry: 'MY',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '3.1390',
    longitude: '101.6869',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '10:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: '10:00',
      closes: '16:00',
    },
  ],
  areaServed: {
    '@type': 'City',
    name: 'Kuala Lumpur',
  },
});

export const createOrganizationSchema = (): OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VELO Luxury',
  url: 'https://veloluxury.my',
  logo: 'https://veloluxury.my/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+60123456789',
    contactType: 'Customer Service',
    areaServed: 'MY',
    availableLanguage: ['en', 'ar'],
  },
  sameAs: [
    'https://www.facebook.com/veloluxury',
    'https://www.instagram.com/veloluxury',
    'https://twitter.com/veloluxury',
  ],
});

export const createProductSchema = (
  name: string,
  description: string,
  image: string | string[],
  price: number,
  brand: string,
  url: string
): ProductSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  image: Array.isArray(image) ? image : [image],
  brand: {
    '@type': 'Brand',
    name: brand,
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'MYR',
    price: price.toString(),
    availability: 'https://schema.org/InStock',
    url,
  },
  category: 'Car Rental',
});

export const createServiceSchema = (): ServiceSchema => ({
  '@context': 'https://schema.org',
  '@type': 'CarRentalService',
  name: 'Luxury Car Rental Service',
  description: 'Premium luxury car rental service in Kuala Lumpur, Malaysia. Offering exclusive access to the world\'s most coveted luxury vehicles.',
  provider: {
    '@type': 'Organization',
    name: 'VELO Luxury',
  },
  areaServed: {
    '@type': 'City',
    name: 'Kuala Lumpur',
  },
  serviceType: 'Car Rental',
});

