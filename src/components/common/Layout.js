import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Link, StaticQuery, graphql } from 'gatsby'
import addToMailchimp from 'gatsby-plugin-mailchimp'
import Img from 'gatsby-image'

import { Navigation } from '.'
import config from '../../utils/siteConfig'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

// Styles
import '../../styles/app.css'

/**
* Main layout component
*
* The Layout component wraps around each page and template.
* It also provides the header, footer as well as the main
* styles, and meta data for each page.
*
*/
class DefaultLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            subscribeError: ``,
            hasSubscribed: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const email = document.getElementById(`subscriberEmail`).value
        addToMailchimp(email)
            .then(({ msg, result }) => {
                if (result !== `success`) {
                    throw msg
                }
                this.setState({ hasSubscribed: true, subscribeError: `` })
            })
            .catch((err) => {
                const junkIndex = err.indexOf(` <`)
                if (junkIndex > 0) {
                    err = err.substring(0, junkIndex)
                }
                this.setState({ subscribeError: err })
            })
    };

    render() {
        const { data, children, bodyClass, isHome } = this.props
        const site = data.allGhostSettings.edges[0].node
        const twitterUrl = `https://twitter.com/youpaired`
        const facebookUrl = `https://www.facebook.com/youpaired`
        const instagramUrl = `https://www.instagram.com/youpaired`
        const linkedinUrl = `https://linkedin.com/company/youpaired/`
        return (
            <>
            <Helmet>
                <html lang={site.lang} />
                <style type="text/css">{`${site.codeinjection_styles}`}</style>
                <body className={bodyClass} />
            </Helmet>

            <div className="viewport">

                <div className="viewport-top">
                    {/* The main header section on top of the screen */}
                    <header className="site-head">
                        <div className="container">
                            <div className="site-mast">
                                <div className="site-mast-left">
                                    <Link to="/">
                                        {site.logo ?
                                            <img className="site-logo" src={site.logo} alt={site.title} />
                                            : <Img fixed={data.file.childImageSharp.fixed} alt={site.title} />
                                        }
                                    </Link>
                                </div>
                                <div className="site-mast-right">
                                    <OutboundLink href={ twitterUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                        <img className="site-nav-icon" src="/images/icons/twitter.svg" alt="Twitter" />
                                    </OutboundLink>
                                    <OutboundLink href={ facebookUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                        <img className="site-nav-icon" src="/images/icons/facebook.svg" alt="Facebook" />
                                    </OutboundLink>
                                    <OutboundLink href={ instagramUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                        <img className="site-nav-icon" src="/images/icons/instagram.svg" alt="Instagram" />
                                    </OutboundLink>
                                    <OutboundLink href={ linkedinUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                        <img className="site-nav-icon" src="/images/icons/linkedin.svg" alt="Linkedin" />
                                    </OutboundLink>
                                    <OutboundLink className="site-nav-item" href={ `https://feedly.com/i/subscription/feed/${config.siteUrl}/rss/` } target="_blank" rel="noopener noreferrer"><img className="site-nav-icon" src="/images/icons/rss.svg" alt="RSS Feed" /></OutboundLink>
                                </div>
                            </div>
                            { isHome ?
                                <div className="site-banner">
                                    <h1 className="site-banner-title">{site.title}</h1>
                                    <p className="site-banner-desc">{site.description}</p>
                                </div> :
                                null}
                            <nav className="site-nav">
                                <div className="site-nav-left">
                                    {/* The navigation items as setup in Ghost */}
                                    <Navigation data={site.navigation} navClass="site-nav-item" />
                                </div>
                            </nav>
                        </div>
                    </header>

                    <main className="site-main">
                        {/* All the main content gets inserted here, index.js, post.js */}
                        {children}
                    </main>

                </div>

                <div className="viewport-bottom">
                    {/* The footer at the very bottom of the screen */}
                    <section className="subscribe-email-container">
                        <div className="subscribe-email-description">
                            <h1>GET A CRASH COURSE ON EVENT SPONSORSHIP PROPOSAL</h1>
                            <p>Sign up for our newsletter and learn about upcoming sponsorship trends.
                            The ultimate guide to event sponsorship opportunities for event organizers and brand partners.</p>
                            <span className="subscribe-email-error">{ this.state.subscribeError }</span>
                        </div>
                        { this.state.hasSubscribed && <div className="subscribe-email-thanks">Thanks for subscribing!</div> }
                        { !this.state.hasSubscribed && <form onSubmit={this.handleSubmit} className="subscribe-email-form">
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                name="subscriberEmail"
                                id="subscriberEmail"
                                aria-label="Subscriber Email"
                                className="email-text"
                            />
                            <span className="subscribe-terms">By entering your email, you agree to receive this and other marketing content
                            about YouPaired. You may opt-out of future marketing emails at any time.
                            Read our <OutboundLink href="https://youpaired.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy here</OutboundLink>.</span>
                            <input type="submit" className="email-button" value="SUBSCRIBE"/>
                        </form> }
                    </section>
                    <footer className="site-foot">
                        <div className="site-foot-nav container">
                            <div className="site-foot-nav-left">
                                <OutboundLink href="https://youpaired.com" target="_blank" rel="noopener noreferrer">YouPaired</OutboundLink> © 2019
                            </div>
                            <div className="site-foot-nav-right">
                                <Navigation data={site.navigation} navClass="site-foot-nav-item" />
                            </div>
                        </div>
                    </footer>

                </div>
            </div>

            </>
        )
    }
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
    bodyClass: PropTypes.string,
    isHome: PropTypes.bool,
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
}

const DefaultLayoutSettingsQuery = props => <StaticQuery
    query={graphql`
        query GhostSettings {
            allGhostSettings {
                edges {
                    node {
                        ...GhostSettingsFields
                    }
                }
            }
            file(relativePath: {eq: "logo-large.png"}) {
                childImageSharp {
                    fixed(width: 175, height: 30) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    `}
    render={data => <DefaultLayout data={data} {...props} />}
/>

export default DefaultLayoutSettingsQuery
