import React, { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';

export interface NextLinkProps
  extends Omit<LinkProps, 'onMouseEnter' | 'onClick' | 'onTouchStart'>,
    Omit<React.ComponentPropsWithoutRef<'a'>, 'href' | 'as'> {}

export const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>((props, ref) => {
  const {
    href,
    as,
    replace,
    scroll,
    shallow,
    passHref,
    prefetch,
    locale,
    legacyBehavior,
    ...otherProps
  } = props;

  return (
    <Link
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
      locale={locale}
      legacyBehavior
      style={{ ...otherProps.style, textDecoration: 'none' }}
    >
      <a {...otherProps} ref={ref} style={{ ...otherProps.style, textDecoration: 'none' }}>
        {props.children}
      </a>
    </Link>
  );
});

NextLink.displayName = '@mantine/next/NextLink';
