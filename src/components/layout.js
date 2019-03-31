import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'

export default ({ location, title, children }) => {
  const data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/icon.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter
          }
        }
      }
    }
  `)

  const headerStyle = { display: 'flex', alignItems: 'center' };
  const h1Style = { fontSize: 20, marginTop: 0, marginBottom: 0 }

  const header = (
    <header style={headerStyle}>
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={data.site.siteMetadata.author}
        style={{
          marginRight: rhythm(1 / 2),
          minWidth: 50,
          marginBottom: 0,
          borderRadius: '100%'
        }}
      />
      <h1 style={h1Style}>
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit',
          }}
          to={'/'}
        >
          {title}
        </Link>
      </h1>
    </header>
  )

  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      {header}
      {children}
    </div>
  )
}
