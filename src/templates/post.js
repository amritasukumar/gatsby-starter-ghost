import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappIcon,
    WhatsappShareButton,
    PinterestIcon,
    PinterestShareButton,
    RedditIcon,
    RedditShareButton,
} from 'react-share'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location }) => {
    const post = data.ghostPost
    const url = location.href
    return (
            <>
                <MetaData
                    data={data}
                    location={location}
                    type="article"
                />
                <Helmet>
                    <style type="text/css">{`${post.codeinjection_styles}`}</style>
                </Helmet>
                <Layout>
                    <div className="container">
                        <div className="post-social-share-container">
                            <FacebookShareButton url={ url } >
                                <FacebookIcon size={40}></FacebookIcon>
                            </FacebookShareButton>
                            <TwitterShareButton url={ url } >
                                <TwitterIcon size={40}></TwitterIcon>
                            </TwitterShareButton>
                            <LinkedinShareButton url={ url } >
                                <LinkedinIcon size={40}></LinkedinIcon>
                            </LinkedinShareButton>
                            <WhatsappShareButton url={ url } >
                                <WhatsappIcon size={40}></WhatsappIcon>
                            </WhatsappShareButton>
                            <PinterestShareButton url={ url } media={ post.feature_image }>
                                <PinterestIcon size={40}></PinterestIcon>
                            </PinterestShareButton>
                            <RedditShareButton url={ url } >
                                <RedditIcon size={40}></RedditIcon>
                            </RedditShareButton>
                        </div>
                        <article className="content">
                            { post.feature_image ?
                                <figure className="post-feature-image">
                                    <img src={ post.feature_image } alt={ post.title } />
                                </figure> : null }
                            <section className="post-full-content">
                                <h1 className="content-title">{post.title}</h1>
                                {/* The main post content */ }
                                <section
                                    className="content-body load-external-scripts"
                                    dangerouslySetInnerHTML={{ __html: post.html }}
                                />
                            </section>
                        </article>
                    </div>
                </Layout>
            </>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Post

export const postQuery = graphql`
    query($slug: String!) {
        ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
        }
    }
`
