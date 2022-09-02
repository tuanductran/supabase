import { forwardRef } from 'react'
import { styled, keyframes } from '@stitches/react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { CaretDownIcon } from '@radix-ui/react-icons'
import { violet, mauve, indigo, purple, blackA } from '@radix-ui/colors'

const enterFromRight = keyframes({
  from: { transform: 'translateX(200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
})

const enterFromLeft = keyframes({
  from: { transform: 'translateX(-200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
})

const exitToRight = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(200px)', opacity: 0 },
})

const exitToLeft = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(-200px)', opacity: 0 },
})

const scaleIn = keyframes({
  from: { transform: 'rotateX(-30deg) scale(0.9)', opacity: 0 },
  to: { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
})

const scaleOut = keyframes({
  from: { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
  to: { transform: 'rotateX(-10deg) scale(0.95)', opacity: 0 },
})

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
})

const StyledMenu = styled(NavigationMenuPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  width: 'inherit',
  zIndex: 1,
})

const StyledList = styled(NavigationMenuPrimitive.List, {
  all: 'unset',
  display: 'flex',
  justifyContent: 'center',
  // backgroundColor: 'white',
  // padding: 4,
  // borderRadius: 6,
  listStyle: 'none',
  // boxShadow: `0 2px 10px ${blackA.blackA7}`,
})

const itemStyles = {
  padding: '8px 12px',
  outline: 'none',
  userSelect: 'none',
  fontWeight: 400,
  lineHeight: 1,
  borderRadius: 4,
  fontSize: '0.875rem',
  color: 'var(--colors-scale11)',
  '&:focus': {
    position: 'relative',
    boxShadow: `0 0 0 2px var(--colors-scale3)`,
    color: 'var(--colors-scale1)',
  },
  '&:hover': {
    // backgroundColor: 'var(--colors-scale12)',
    color: 'var(--colors-scale12)',
    cursor: 'pointer',
  },
}

const StyledTrigger = styled(NavigationMenuPrimitive.Trigger, {
  all: 'unset',
  ...itemStyles,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
})

const StyledCaret = styled(CaretDownIcon, {
  position: 'relative',
  color: 'var(--colors-scale8)',
  top: 1,
  '[data-state=open] &': {
    transform: 'rotate(-180deg)',
    color: 'var(--colors-scale11)',
  },
  '@media (prefers-reduced-motion: no-preference)': {
    transition: 'transform 250ms ease',
  },
})

// eslint-disable-next-line react/display-name
const StyledTriggerWithCaret = forwardRef(({ children, ...props }, forwardedRef) => (
  // @ts-ignore
  <StyledTrigger {...props} ref={forwardedRef}>
    {children}
    <StyledCaret aria-hidden />
  </StyledTrigger>
))

const StyledLink = styled(NavigationMenuPrimitive.Link, {
  ...itemStyles,
  display: 'block',
  textDecoration: 'none',
  lineHeight: 1,
})

const StyledContent = styled(NavigationMenuPrimitive.Content, {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  '@media only screen and (min-width: 600px)': { width: 'auto' },
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '250ms',
    animationTimingFunction: 'ease',
    '&[data-motion="from-start"]': { animationName: enterFromLeft },
    '&[data-motion="from-end"]': { animationName: enterFromRight },
    '&[data-motion="to-start"]': { animationName: exitToLeft },
    '&[data-motion="to-end"]': { animationName: exitToRight },
  },
})

const StyledIndicator = styled(NavigationMenuPrimitive.Indicator, {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  height: 10,
  top: '100%',
  overflow: 'hidden',
  zIndex: 1,

  '@media (prefers-reduced-motion: no-preference)': {
    transition: 'width, transform 250ms ease',
    '&[data-state="visible"]': { animation: `${fadeIn} 200ms ease` },
    '&[data-state="hidden"]': { animation: `${fadeOut} 200ms ease` },
  },
})

const StyledArrow = styled('div', {
  position: 'relative',
  top: '70%',
  backgroundColor: 'var(--colors-scale3)',
  width: 10,
  height: 10,
  transform: 'rotate(45deg)',
  borderTopLeftRadius: 2,
})

// eslint-disable-next-line react/display-name
const StyledIndicatorWithArrow = forwardRef((props, forwardedRef) => (
  // @ts-expect-error
  <StyledIndicator {...props} ref={forwardedRef}>
    <StyledArrow />
  </StyledIndicator>
))

const StyledViewport = styled(NavigationMenuPrimitive.Viewport, {
  position: 'absolute',
  transformOrigin: 'top center',
  marginTop: 10,
  width: 'inherit',
  backgroundColor: 'var(--colors-scale3)',
  borderRadius: 6,
  overflow: 'hidden',
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  height: 'var(--radix-navigation-menu-viewport-height)',

  '@media only screen and (min-width: 600px)': {
    width: 'var(--radix-navigation-menu-viewport-width)',
  },
  '@media (prefers-reduced-motion: no-preference)': {
    transition: 'width, height, 300ms ease',
    '&[data-state="open"]': { animation: `${scaleIn} 200ms ease` },
    '&[data-state="closed"]': { animation: `${scaleOut} 200ms ease` },
  },
})

// Exports
const NavigationMenu = (props: any) => <StyledMenu {...props} />
const NavigationMenuList = (props: any) => <StyledList {...props} />
const NavigationMenuItem = (props: any) => <NavigationMenuPrimitive.Item {...props} />
const NavigationMenuTrigger = (props: any) => <StyledTriggerWithCaret {...props} />
const NavigationMenuLink = (props: any) => <StyledLink {...props} />
const NavigationMenuContent = (props: any) => <StyledContent {...props} />
const NavigationMenuViewport = (props: any) => <StyledViewport {...props} />
const NavigationMenuIndicator = (props: any) => <StyledIndicatorWithArrow {...props} />

// Your app...
const ContentList = styled('ul', {
  display: 'grid',
  padding: 22,
  margin: 0,
  columnGap: 10,
  listStyle: 'none',

  variants: {
    layout: {
      one: {
        '@media only screen and (min-width: 600px)': {
          width: 500,
          gridTemplateColumns: '.75fr 1fr',
        },
      },
      two: {
        '@media only screen and (min-width: 600px)': {
          width: 600,
          gridAutoFlow: 'column',
          gridTemplateRows: 'repeat(3, 1fr)',
        },
      },
    },
  },
})

const ListItem = styled('li', {})

const LinkTitle = styled('div', {
  fontWeight: 400,
  lineHeight: 1.2,
  marginBottom: 5,
  color: 'var(--colors-scale12)',
  // color: violet.violet12,
})

const LinkText = styled('p', {
  all: 'unset',
  color: mauve.mauve11,
  lineHeight: 1.4,
  fontWeight: 'initial',
})

// @ts-ignore
// eslint-disable-next-line react/display-name
const ContentListItem = forwardRef(({ children, title, ...props }, forwardedRef) => (
  <ListItem>
    <NavigationMenuLink
      {...props}
      // ref={forwardedRef}
      css={{
        padding: 12,
        borderRadius: 6,
        '&:hover': { backgroundColor: 'var(--colors-scale4)' },
      }}
    >
      <LinkTitle>{title}</LinkTitle>
      <LinkText>{children}</LinkText>
    </NavigationMenuLink>
  </ListItem>
))

// eslint-disable-next-line react/display-name
const ContentListItemCallout = forwardRef(({ children, ...props }, forwardedRef) => (
  <ListItem css={{ gridRow: 'span 3' }}>
    <NavigationMenuLink
      {...props}
      href="/"
      // ref={forwardedRef}
      css={{
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${purple.purple9} 0%, ${indigo.indigo9} 100%);`,
        borderRadius: 6,
        padding: 25,
      }}
    >
      <svg aria-hidden width="38" height="38" viewBox="0 0 25 25" fill="white">
        <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
        <path d="M12 0H4V8H12V0Z"></path>
        <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
      </svg>
      <LinkTitle
        css={{
          fontSize: 18,
          color: 'white',
          marginTop: 16,
          marginBottom: 7,
        }}
      >
        Radix Primitives
      </LinkTitle>
      <LinkText
        css={{
          fontSize: 14,
          color: mauve.mauve4,
          lineHeight: 1.3,
        }}
      >
        Unstyled, accessible components for React.
      </LinkText>
    </NavigationMenuLink>
  </ListItem>
))

const ViewportPosition = styled('div', {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  top: '100%',
  left: 0,
  perspective: '2000px',
})

const NavigationMenuDemo = (props: any) => {
  return (
    <NavigationMenu>
      {props.left}
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Docs</NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {/* 
          // @ts-ignore */}
          <NavigationMenuTrigger>{'Tutorials'}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ContentList layout="two">
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Angular" href="/docs/tutorials/with-angular">
                build a simple user management app
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem
                title="Getting started"
                href="/docs/primitives/overview/getting-started"
              >
                A quick tutorial to get you up and running with Radix Primitives.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Styling" href="/docs/primitives/overview/styling">
                Unstyled and compatible with any styling solution.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Animation" href="/docs/primitives/overview/animation">
                Use CSS keyframes or any animation library of your choice.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Accessibility" href="/docs/primitives/overview/accessibility">
                Tested in a range of browsers and assistive technologies.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Releases" href="/docs/primitives/overview/releases">
                Radix Primitives releases and their changelogs.
              </ContentListItem>
            </ContentList>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {/* 
          // @ts-ignore */}
          <NavigationMenuTrigger>APIs & CLI</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ContentList layout="one">
              <ContentListItemCallout />
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Javascript" href="/docs/reference/javascript/installing">
                @supabase/supabase-js
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="CLI" href="/docs/reference/cli/installing">
                Command line interface
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Dart" href="/docs/reference/dart/installing">
                Dart
              </ContentListItem>
            </ContentList>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {/* 
          // @ts-ignore */}
          <NavigationMenuTrigger>GitHub</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ContentList layout="two">
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Introduction" href="/docs/primitives/overview/introduction">
                Build high-quality, accessible design systems and web apps.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem
                title="Getting started"
                href="/docs/primitives/overview/getting-started"
              >
                A quick tutorial to get you up and running with Radix Primitives.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Styling" href="/docs/primitives/overview/styling">
                Unstyled and compatible with any styling solution.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Animation" href="/docs/primitives/overview/animation">
                Use CSS keyframes or any animation library of your choice.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Accessibility" href="/docs/primitives/overview/accessibility">
                Tested in a range of browsers and assistive technologies.
              </ContentListItem>
              {/* 
          // @ts-ignore */}
              <ContentListItem title="Releases" href="/docs/primitives/overview/releases">
                Radix Primitives releases and their changelogs.
              </ContentListItem>
            </ContentList>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuIndicator />
      </NavigationMenuList>

      <ViewportPosition>
        <NavigationMenuViewport />
      </ViewportPosition>
      {props.right}
    </NavigationMenu>
  )
}

export { NavigationMenuDemo }
