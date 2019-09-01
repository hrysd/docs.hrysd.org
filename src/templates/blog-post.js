import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
      }
    }
  }
`

export default ({ location, pageContext, data }) => {
  const { markdownRemark: post, site } = data;
  const { previous, next } = pageContext;

  return (
    <Layout location={location} title={site.siteMetadata.title}>
      <SEO title={post.frontmatter.title} description={post.excerpt} />

      <h1 style={{ fontSize: 24, marginBottom: 10 }}>{post.frontmatter.title}</h1>

      <hr style={{ color: '#90a4ae' }} />
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr style={{ color: '#90a4ae' }} />
    </Layout>
  );
}