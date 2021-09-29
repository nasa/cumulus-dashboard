// Functions to split pages into sections.
import React from 'react';

export const pageSection = (title, sectionId, children) => section({ title, sectionId, children });

export const sectionHeader = (title, sectionId, link) => section({ sectionId, title, link, size: 'large', border: true });

export const section = ({
  sectionId,
  title,
  link,
  border = false,
  size = 'medium',
  children,
}) => {
  const borderMod = border ? '--border' : '';
  const sizeMod = `--${size}`;
  const id = sectionId || '';
  const headerClass = (link !== undefined) ? 'heading--shared-content--right' : '';
  return (
    <section className='page__section' id={id}>
      <div className="row">
        <div className={`heading__wrapper${borderMod}`}>
          <h2 className={`heading${sizeMod} ${headerClass}`}>
            {title}
          </h2>
          {link}
        </div>
        {children}
      </div>
    </section>
  );
};
