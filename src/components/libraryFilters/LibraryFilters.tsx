import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import * as React from 'react';
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
export interface ILibraryFiltersProps extends WithStyles<typeof styles> {
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
 * Styles
 */

const styles = (theme: Theme) =>
  createStyles({
    selected: {
      backgroundColor: theme.palette.primary.main,
      color: 'transparent'
    }
  });

/**
 * Styled components
 */
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
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

const updateClassesFiltersLocation = (
  updateClassesFilters: (value: any) => void,
  e: any,
  value: string
) => {
  updateClassesFilters({ variables: { classLocation: value } });
};

const updateClassesFiltersType = (
  updateClassesFilters: (value: any) => void,
  e: any,
  value: string
) => {
  updateClassesFilters({ variables: { classType: value } });
};

/**
 * Library filters component: renders filters for seaching classes in the Library
 */
const LibraryFilters: React.SFC<ILibraryFiltersProps> = ({
  classes,
  selectedClassLocation,
  selectedClassType
}) => (
  <Container>
    <UpdateClassesFiltersMutation mutation={UPDATE_CLASSES_FILTERS}>
      {updateClassesFilters => (
        <ToggleButtonGroup
          value={selectedClassLocation}
          exclusive={true}
          onChange={updateClassesFiltersLocation.bind(
            null,
            updateClassesFilters
          )}
        >
          {Object.keys(classLocations).map((classLocationKey, i) => {
            const classLocation: ClassLocation =
              classLocations[classLocationKey];
            const isSelected = classLocation === selectedClassLocation;
            return (
              <ToggleButton
                key={i}
                value={classLocation}
                selected={isSelected}
                classes={{ selected: classes.selected }}
              >
                {getIcon(classLocation, isSelected)}{' '}
                <Typography>{classLocation}</Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      )}
    </UpdateClassesFiltersMutation>

    <UpdateClassesFiltersMutation mutation={UPDATE_CLASSES_FILTERS}>
      {updateClassesFilters => (
        <ToggleButtonGroup
          value={selectedClassType}
          exclusive={true}
          onChange={updateClassesFiltersType.bind(null, updateClassesFilters)}
        >
          {Object.keys(classTypes).map((classTypeKey, i) => {
            const classType: ClassType = classTypes[classTypeKey];
            const isSelected = classType === selectedClassType;
            return (
              <ToggleButton
                key={i}
                value={classType}
                selected={isSelected}
                classes={{ selected: classes.selected }}
              >
                {getIcon(classType, isSelected)}{' '}
                <Typography>{classType}</Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      )}
    </UpdateClassesFiltersMutation>
  </Container>
);

export default withStyles(styles)(LibraryFilters);
