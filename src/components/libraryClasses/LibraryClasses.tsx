import get from 'get-value';
import React from 'react';
import { LibraryClassButton } from 'src/components';
import { CLASS_IDS_QUERY, ClassIdsQuery } from './queries';

/**
 * LibraryClasses: fetches classes for selection made in Library
 */
class LibraryClasses extends React.Component {
  public render() {
    return (
      <ClassIdsQuery query={CLASS_IDS_QUERY} fetchPolicy="cache-only">
        {({ loading, error, data }) => {
          if (loading || error) {
            // tslint:disable-next-line:no-console
            console.log(loading || error);
          }

          const classIds = (data && get(data, 'canvas.classIds')) || [];
          return (
            <ul id="library-class-button-container">
              {classIds.map((classId: string, i: number) => (
                <LibraryClassButton
                  key={`${classId}${i}`}
                  id={classId}
                  renderSelected={false}
                />
              ))}
            </ul>
          );
        }}
      </ClassIdsQuery>
    );
  }
}

export default LibraryClasses;
