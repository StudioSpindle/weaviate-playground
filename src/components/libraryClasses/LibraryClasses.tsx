import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { LibraryClassButton } from 'src/components';

/**
 * LibraryClasses: fetches classes for selection made in Library
 */
const LibraryClasses: React.SFC = () => (
  <Query
    query={gql`
      query classIds {
        canvas @client {
          classIds
        }
      }
    `}
  >
    {(query: any) => {
      const classIds = query.data.canvas.classIds;
      return (
        <ul>
          {classIds.map((classId: string, i: number) => (
            <LibraryClassButton key={i} id={classId} renderSelected={false} />
          ))}
        </ul>
      );
    }}
  </Query>
);

export default LibraryClasses;
