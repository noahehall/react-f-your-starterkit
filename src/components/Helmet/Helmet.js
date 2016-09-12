/* eslint-disable */
import React from 'react';
import Helmet from 'react-helmet';

export default function HTML () {
    const attrs = head.htmlAttributes.toComponent();

    return (
        <html {...attrs}>
            <head>
                {head.title.toComponent()}
                {head.meta.toComponent()}
                {head.link.toComponent()}
            </head>
            <body>
                <div id="content">
                    // React stuff here
                </div>
            </body>
        </html>
    );
}
