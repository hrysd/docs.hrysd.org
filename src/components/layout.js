import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'

export default ({ location, title, children }) => {
  const data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/logo.png/" }) {
        childImageSharp {
          fixed(width: 170, height: 138) {
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

  const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const h1Style = { fontSize: 20, marginTop: 0, marginBottom: 0 }

  const header = (
    <header style={headerStyle}>
      <h1 style={h1Style}>
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit',
          }}
          to={'/'}
        >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={title}
        style={{
          minWidth: 50,
          marginBottom: 0,
        }}
      />
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
