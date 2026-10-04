import { Helmet } from 'react-helmet-async';
import website_name from '../../config/website';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, image, type = 'website' }) {
  const location = useLocation();
  const canonicalUrl = `https://zenimes.onrender.com${location.pathname === '/' ? '' : location.pathname}`;
  
  const defaultTitle = `${website_name} | Free anime streaming platform`;
  const defaultDescription = "Watch free anime online in HD on Zenime. Stream latest Hindi Anime, English Subbed and Dubbed series, movies, and episodes with zero ads. Free anime streaming platform!";
  const defaultImage = "https://i.postimg.cc/pVqqMKkR/2IAVHlI.webp";

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name='description' content={seoDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph tags for social media sharing */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={website_name} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
}
