import React from 'react';
import { Query } from 'react-apollo';
import { Tag, Text } from 'src/components';
import {
  ActionIcon,
  AddIcon,
  CheckIcon,
  ThingIcon
} from 'src/components/icons';
import {
  GET_LIBRARY_CLASS_BUTTON_QUERY,
  UPDATE_SELECTED_CLASSES,
  UpdateSelectedClassesMutation
} from 'src/components/libraryClassButton/queries';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Types
 */
export interface ILibraryClassProps {
  id: string;
  renderSelected: boolean;
}

/**
 * Styled components
 */
const Container = styled.button`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
  border: none;
  &:hover {
    background-color: ${getColor('indigo', 'tint-3')};
  }
`;

const IconNameContainer = styled.div`
  display: flex;
`;

const IconContainer = styled.div`
  display: flex;
  margin-left: 1em;
  margin-right: 1em;
`;

const iconSize = 24;
const iconProps = {
  height: iconSize + 'px',
  isFilled: true,
  width: iconSize + 'px'
};

const updateSelection = (updateSelectedClasses: any, id: string) =>
  updateSelectedClasses({ variables: { id } });

/**
 * LibraryClassButton component: renders button used for each class in Library
 */
const LibraryClassButton: React.SFC<ILibraryClassProps> = ({
  id,
  renderSelected
}: ILibraryClassProps) => (
  <Query query={GET_LIBRARY_CLASS_BUTTON_QUERY} variables={{ id }}>
    {classQuery => {
      if (classQuery.loading) {
        return (
          <li>
            <Container>
              <div>
                <Text>Loading...</Text>
              </div>
            </Container>
          </li>
        );
      }

      if (classQuery.error) {
        return (
          <li>
            <Container>
              <div>
                <Text>${classQuery.error.message}</Text>
              </div>
            </Container>
          </li>
        );
      }

      const {
        instance,
        isSelected,
        name,
        classLocation,
        classType
      } = classQuery.data.class;
      const classesFilters = classQuery.data.classesFilters;

      /**
       * Do not render buttons that do not filter criteria
       */
      if (
        !renderSelected &&
        (isSelected ||
          (classesFilters.classType !== 'All' &&
            classType !== classesFilters.classType) ||
          classLocation !== classesFilters.classLocation ||
          !name
            .toLowerCase()
            .includes(classesFilters.queryString.toLowerCase()))
      ) {
        return null;
      }

      return (
        <UpdateSelectedClassesMutation
          mutation={UPDATE_SELECTED_CLASSES}
          variables={{ id }}
        >
          {(updateSelectedClasses: any) => (
            <li>
              <Container
                onClick={updateSelection.bind(null, updateSelectedClasses, id)}
              >
                <IconNameContainer>
                  <IconContainer>
                    {classType === 'Things' && <ThingIcon {...iconProps} />}
                    {classType === 'Actions' && <ActionIcon {...iconProps} />}
                  </IconContainer>
                  <Text fontWeight="bold">
                    {name} <Tag>{instance}</Tag>
                  </Text>
                </IconNameContainer>

                <IconContainer>
                  {isSelected ? (
                    <CheckIcon width="24px" height="24px" color="vividPink" />
                  ) : (
                    <AddIcon width="24px" height="24px" />
                  )}
                </IconContainer>
              </Container>
            </li>
          )}
        </UpdateSelectedClassesMutation>
      );
    }}
  </Query>
);

export default LibraryClassButton;
