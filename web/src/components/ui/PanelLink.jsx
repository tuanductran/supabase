import React from 'react'
import { css } from '@stitches/core'
import ThemedImage from '@theme/ThemedImage'
import useBaseUrl from '@docusaurus/useBaseUrl'

const button = css({
  position: 'relative',
  outline: 'none',
  width: '100%',
  background: 'transparent',
  display: 'flex',
  gap: '16px',
  // height: '80px',
  // padding: '8px 16px',
  justifyContent: 'flex-start',

  '&:hover': {
    // background: 'black',
    cursor: 'pointer',
  },

  '&:hover .panel-link__hover': {
    opacity: '25%',
  },
})

const titleContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

const title = css({
  fontSize: '1rem',
  display: 'flex',
  flexDirection: 'col',
  fontWeight: '500 !important',
  marginBottom: 0,
})

const subtitle = css({
  fontSize: '0.9rem',
  color: 'gray',
  lineHeight: '1rem',
})

const icon = css({
  marginTop: '0px',
  borderRadius: '100%',
  background: 'var(--ifm-card-background-color)',
  width: '60px',
  height: '60px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const cardHover = css({
  background: 'black',
  position: 'absolute',
  top: '-0.75rem',
  right: '-0.75rem',
  bottom: '-0.75rem',
  left: '-0.75rem',
  borderRadius: '0.75rem',
  opacity: 0,
  zIndex: '-10',
})

const PanelLink = (props) => {
  console.log(props.icon)
  return (
    <a className={button()}>
      <div className={[cardHover(), 'panel-link__hover'].join(' ')}></div>
      {props.icon && (
        <div>
          <div className={icon()}>
            {/* <props.icon width={24} /> */}
            <ThemedImage
              // alt={x.name}
              width="28"
              sources={{
                light: useBaseUrl(props.icon),
                dark: props.iconDark ? useBaseUrl(props.iconDark) : useBaseUrl(props.icon),
              }}
            />
          </div>
        </div>
      )}
      <div className={titleContainer()}>
        <h4 className={title()}>{props.title}</h4>
        <p className={subtitle()}>{props.subtitle}</p>
      </div>
    </a>
  )
}

export { PanelLink }
