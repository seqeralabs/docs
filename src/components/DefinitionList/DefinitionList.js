import React from 'react';
import Link from '@docusaurus/Link';

// Recursively extract plain text from React children
function extractText(children) {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (children && typeof children === 'object' && children.props) {
    return extractText(children.props.children);
  }
  return '';
}

// Simple slugify function
function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]]/gi, '') // remove special chars including [ and ]
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-') // collapse multiple -
    .replace(/^-+|-+$/g, ''); // trim - from start/end
}

export function DefinitionTerm({ children }) {
  // Extract plain text from children for slug and anchor name
  const text = extractText(children).trim();
  const id = slugify(text);
  const link = `#${id}`;

  return (
    <dt
      id={id}
      style={{
        fontWeight: 'bold',
        fontSize: '1.15em',
        marginTop: '1.5em',
        marginBottom: '0.3em',
        lineHeight: 1.3,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.5em' }}>
        <span>{children}</span>
        <Link
          to={link}
          aria-label={`Anchor link to ${text}`}
          title={text}
          className="definition-anchor-link"
          tabIndex={-1}
          name={id}
        >
          #
        </Link>
      </span>
      <style>{`
        dt:hover .definition-anchor-link,
        dt:focus-within .definition-anchor-link {
          opacity: 1;
        }
        .definition-anchor-link {
          opacity: 0;
        }
      `}</style>
    </dt>
  );
}

export function DefinitionDescription({ children }) {
  return <dd>{children}</dd>;
}

export default function DefinitionList({ children }) {
  return <dl>{children}</dl>;
}
