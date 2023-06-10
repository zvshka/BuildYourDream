// import Document from 'next/document';
// import { createGetInitialProps } from '@mantine/next';
//
// const getInitialProps = createGetInitialProps();
//
// export default class _Document extends Document {
//   static getInitialProps = getInitialProps;
// }
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import { createGetInitialProps } from '@mantine/next';

const getInitialProps = createGetInitialProps();

export default class Document extends NextDocument {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
