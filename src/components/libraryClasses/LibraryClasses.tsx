import get from 'get-value';
import React from 'react';
import { LibraryClassButton } from 'src/components';
import { CLASS_IDS_QUERY, ClassIdsQuery } from './queries';

/**
 * LibraryClasses: fetches classes for selection made in Library
 */
const LibraryClasses: React.SFC = () => (
  <ClassIdsQuery query={CLASS_IDS_QUERY}>
    {(query: any) => {
      const classIds = get(query, 'data.canvas.classIds') || [];
      return (
        <ul>
          {classIds.map((classId: string, i: number) => (
            <LibraryClassButton key={i} id={classId} renderSelected={false} />
          ))}
        </ul>
      );
    }}
  </ClassIdsQuery>
);

export default LibraryClasses;
