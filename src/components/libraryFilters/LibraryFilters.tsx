import * as React from 'react';
import { Button } from 'src/components';
import {
  ActionIcon,
  LocalIcon,
  NetworkIcon,
  ThingIcon
} from 'src/components/icons';
import {
  UPDATE_CLASSES_FILTERS,
  UpdateClassesFiltersMutation
} from 'src/components/library/queries';
import { ClassLocation, ClassType } from 'src/types';
import { Color } from 'src/utils/getColor';
import styled from 'styled-components';

/**
 * Types
 */
export interface ILibraryFiltersProps {
  selectedClassLocation: ClassLocation;
  selectedClassType: ClassType;
}

interface IClassLocations {
  local: ClassLocation;
  network: ClassLocation;
}

interface IClassTypes {
  all: ClassType;
  things: ClassType;
  actions: ClassType;
}

/**
 * Statics
 */
export const classLocations: IClassLocations = {
  local: 'Local',
  network: 'Network'
};

export const classTypes: IClassTypes = {
  all: 'All',
  things: 'Things',
  // tslint:disable-next-line:object-literal-sort-keys
  actions: 'Actions'
};

/**
 * Styled components
 */
const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LibraryFilterSection = styled.div`
  display: flex;
`;

const getIcon = (value: ClassLocation | ClassType, isSelected: boolean) => {
  const iconSize = 15;
  const props = {
    color: isSelected ? 'white' : ('almostBlack' as Color),
    height: iconSize + 'px',
    isFilled: true,
    width: iconSize + 'px'
  };
  switch (value) {
    case classLocations.local:
      return <LocalIcon {...props} />;
    case classLocations.network:
      return <NetworkIcon {...props} />;
    case classTypes.actions:
      return <ActionIcon {...props} />;
    case classTypes.things:
      return <ThingIcon {...props} />;
    default:
      return undefined;
  }
};

/**
 * Library filters component: renders filters for seaching classes in the Library
 */
const LibraryFilters: React.SFC<ILibraryFiltersProps> = ({
  selectedClassLocation,
  selectedClassType
}) => (
  <Container>
    <LibraryFilterSection>
      {Object.keys(classLocations).map((classLocationKey, i) => {
        const classLocation: ClassLocation = classLocations[classLocationKey];
        const isSelected = classLocation === selectedClassLocation;
        return (
          <UpdateClassesFiltersMutation
            key={i}
            mutation={UPDATE_CLASSES_FILTERS}
            variables={{ classLocation }}
          >
            {updateClassesFilters => (
              <Button
                title={classLocation}
                icon={getIcon(classLocation, isSelected)}
                isSelected={isSelected}
                onClick={updateClassesFilters}
                value={classLocation}
              />
            )}
          </UpdateClassesFiltersMutation>
        );
      })}
    </LibraryFilterSection>
    <LibraryFilterSection>
      {Object.keys(classTypes).map((classTypeKey, i) => {
        const classType: ClassType = classTypes[classTypeKey];
        const isSelected = classType === selectedClassType;
        return (
          <UpdateClassesFiltersMutation
            key={i}
            mutation={UPDATE_CLASSES_FILTERS}
            variables={{ classType }}
          >
            {updateClassesFilters => (
              <Button
                key={i}
                title={classType}
                icon={getIcon(classType, isSelected)}
                isSelected={isSelected}
                onClick={updateClassesFilters}
                value={classType}
              />
            )}
          </UpdateClassesFiltersMutation>
        );
      })}
    </LibraryFilterSection>
  </Container>
);

export default LibraryFilters;
