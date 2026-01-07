import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Button from "../../../components/Button";

export default function NotFoundContent({className, path}) {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="font-title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page">
              Page not found
            </Translate>{path && `: ` + path}
          </Heading>
          <p>
            <Translate
              id="theme.NotFound.p1"
              description="The first paragraph of the 404 page">
             404: Something has gone wrong with our dataflow. The page you are looking for does not exist.
            </Translate>
          </p>
          <p>
          <Button to="/platform-cloud" blue medium alt className="mb-8 mt-4">Back to the docs</Button>
          </p>
        </div>
      </div>
    </main>
  );
}

