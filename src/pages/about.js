import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "./index.css"
import Sidebar from "../components/sidebar/Sidebar"

import lelogo from "../images/littleendian-logo.png"

const AboutPage = (props) => {
    return (
        <Layout>
            <SEO title="About" />
            <div className="post-page-main">
                <div className="sidebar px-4 py-2">
                    <Sidebar />
                </div>

                <div className="post-main">
                    <SEO title="About" />
                    <div className="mt-3">
                        <h2 className="heading">About</h2>
                        <p><i>Software is like a superpower, you can change the world  </i>
                            Born software developer, I can't remeber a time of my life where code wasn't present. 
                            Crafting products with code is one of the things that gives me fun and satisfaction.
                        </p>

                        <br />

                        <div>
                            <h4>Sponsors</h4>

                            <a className="text-primary ml-4" href="http://www.little-endian.it">
                                <span title="Little Endian">
                                    <img src={lelogo} style={{ maxWidth: `100px` }} alt="" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}



export default AboutPage

