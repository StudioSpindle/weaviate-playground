import * as React from 'react';

interface IResultsJsonProps {
  data: any;
}

const ResultsJson: React.SFC<IResultsJsonProps> = ({ data }) => (
  <textarea
    style={{ height: '100%', width: '100%', border: 'none' }}
    rows={25}
    value={JSON.stringify(data, undefined, 4)}
    readOnly={true}
  />
);

export default ResultsJson;
