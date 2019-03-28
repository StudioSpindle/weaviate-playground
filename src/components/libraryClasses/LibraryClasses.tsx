import get from 'get-value';
import React from 'react';
import { LibraryClassButton } from 'src/components';
import { CLASS_IDS_QUERY, ClassIdsQuery } from './queries';

export interface ILibraryClassesProps {
  setLibraryClassesQuery(libraryClassesQuery: any): void;
}

export interface ILibraryClassesState {
  isLibraryClassesQuerySet: boolean;
}

/**
 * LibraryClasses: fetches classes for selection made in Library
 */
class LibraryClasses extends React.Component<
  ILibraryClassesProps,
  ILibraryClassesState
> {
  constructor(props: ILibraryClassesProps) {
    super(props);
    this.state = {
      isLibraryClassesQuerySet: false
    };
  }

  public setLibraryClassesQuery = (libraryClassQuery: any) => {
    const { isLibraryClassesQuerySet } = this.state;
    const { setLibraryClassesQuery } = this.props;
    if (!isLibraryClassesQuerySet) {
      setLibraryClassesQuery(libraryClassQuery);
      this.setState({ isLibraryClassesQuerySet: true });
    }
  };

  public render() {
    return (
      <ClassIdsQuery query={CLASS_IDS_QUERY}>
        {(query: any) => {
          this.setLibraryClassesQuery(query);
          const classIds = get(query, 'data.canvas.classIds') || [];
          return (
            <ul>
              {classIds.map((classId: string, i: number) => (
                <LibraryClassButton
                  key={i}
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
