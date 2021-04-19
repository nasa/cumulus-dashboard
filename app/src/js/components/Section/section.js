import React from 'react';

export const pageSection = (title, className, children) => section({ title, className, children });

export const sectionHeader = (className, title, link) => section({ className, title, link, size: 'large', border: true });

export const section = ({
  className,
  title,
  link,
  border = false,
  size = 'medium',
  children,
}) => {
  const borderMod = border ? '--border' : '';
  const sizeMod = `--${size}`;
  const additionalClassName = className || '';
  return (
    <section className={`page__section ${additionalClassName}`}>
      <div className="row">
        <div className={`heading__wrapper${borderMod}`}>
          <h2 className={`heading${sizeMod}`}>
            {title}
          </h2>
          {link}
        </div>
        {children}
      </div>
    </section>
  );
};
