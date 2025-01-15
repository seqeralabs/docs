import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/NotFound/Content';
import Heading from '@theme/Heading';
import Button from "../../../components/Button";

export default function NotFoundContent({className}: Props): JSX.Element {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="font-title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page">
              404: Something has gone wrong with our dataflow
            </Translate>
          </Heading>
          <p>
            <Translate
              id="theme.NotFound.p1"
              description="The first paragraph of the 404 page">
              The page you are looking for doesn't exist. 
            </Translate>
          </p>
          <p>
            <Button to="/" blue medium alt className="mb-8 mt-4">Documentation Home</Button>
          </p>
        </div>
      </div>
    </main>
  );
}
