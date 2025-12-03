import { useEffect, useRef } from 'react';

function upsertMeta(attrName, attrValue, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attrName}='${attrValue}']`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel='${rel}']`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SEO({
  title,
  description,
  url,
  image = '/og-image.jpg',
  jsonLd, // object or array of objects
  transientTitle = false, // when true, restore previous title on unmount
}) {
  const prevTitleRef = useRef();
  const createdJsonLdNodesRef = useRef([]);
  const jsonLdString = JSON.stringify(jsonLd || null);

  useEffect(() => {
    if (transientTitle) prevTitleRef.current = document.title;
    if (title) document.title = title;
    if (description) upsertMeta('name', 'description', description);

    // Open Graph
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:type', 'website');

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    // Canonical
    upsertLink('canonical', url);

    // JSON-LD injection
    const asArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    const created = [];
    asArray.forEach((obj) => {
      try {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-managed-by', 'seo-helper');
        script.text = JSON.stringify(obj);
        document.head.appendChild(script);
        created.push(script);
      } catch {
        // ignore JSON stringify issues
      }
    });
    createdJsonLdNodesRef.current = created;

    return () => {
      // cleanup json-ld nodes
      createdJsonLdNodesRef.current.forEach((node) => {
        if (node && node.parentNode) node.parentNode.removeChild(node);
      });
      createdJsonLdNodesRef.current = [];
      if (transientTitle && prevTitleRef.current !== undefined) {
        document.title = prevTitleRef.current;
      }
    };
  }, [title, description, url, image, transientTitle, jsonLdString, jsonLd]);

  return null;
}
