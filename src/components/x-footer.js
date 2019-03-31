import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'

const bioQuery = graphql`
  query BioQuery {
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
`
export default () => {
  const data = useStaticQuery(bioQuery);
  const { author, social } = data.site.siteMetadata;

  return (
    <footer className='Footer'>
      <div className='Footer-profile'>
        <Image
          className='Footer-profileImage'
          fixed={data.avatar.childImageSharp.fixed}
          alt={author}
        />
        <dl>
          <dt>Twitter:</dt>
          <dd><a href={`https://twitter.com/${social.twitter}`} target='_blank' rel='noopener'>@hrysd</a></dd>
          <dt>GitHub:</dt>
          <dd><a href={`https://github.com/${social.github}`} target='_blank' rel='noopener'>@hrysd</a></dd>
        </dl>
      </div>
      <p className='Footer-poweredBy'>Powered by <a href='https://www.gatsbyjs.org/' target='_blank' rel='noopener noreferrer'>Gatsby</a>.</p>
    </footer>
  );
};
