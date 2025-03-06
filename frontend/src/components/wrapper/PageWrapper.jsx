import React from "react";
import { Helmet } from "react-helmet-async";

const PageWrapper = ({ title, appName = "Inner Circle", children }) => {
  // Construct the page title
  const pageTitle = title ? `${title} | ${appName}` : appName;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {children}
    </>
  );
};

export default PageWrapper;
