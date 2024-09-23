import React, { useState, useRef, useEffect } from 'react';
import { useDocsVersion, useDocsPreferredVersion } from '@docusaurus/theme-common/internal';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Caret from '../ProductSwitcher/images/caret.svg';

const VersionSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { versions, latestVersion } = useDocsPreferredVersion('platform');
  // const currentVersion = useDocsVersion();
  const currentVersion = 'foo';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Only show for Seqera Platform pages
  /*
  if (!location.pathname.startsWith('/platform')) {
    return null;
  }
    */

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex justify-between items-center w-full rounded-md my-4 py-3 px-4 cursor-pointer bg-white dark:bg-brand-1400 border border-gray-300 dark:border-brand-800 ${
          isOpen ? 'rounded-b-none' : ''
        }`}
        ref={dropdownRef}
      >
        <span>Version: {currentVersion.label}</span>
        <Caret className={`w-6 h-6 ml-2 transition-transform duration-200 fill-black dark:fill-white ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-10 bg-white dark:bg-brand-1400 border border-gray-300 dark:border-brand-800 border-t-0 rounded-b-md">
          {versions.map((version) => (
            <Link
              key={version.name}
              to={version.path}
              className="flex items-center w-full p-3 border-b border-gray-200 dark:border-brand-800 last:border-b-0 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-brand-1300"
              onClick={() => setIsOpen(false)}
            >
              {version.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionSwitcher;
