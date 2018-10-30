import gql from 'graphql-tag';
import { IUpdateClassesFiltersVariables } from 'src/components/library/queries';

export const defaults = {
  canvas: {
    __typename: 'Canvas',
    classIds: [],
    selectedClass: 'City',
    selectedClasses: [],
    zoom: 1
  },
  class: {
    __typename: 'Class',
    classLocation: 'Local',
    classType: 'Things',
    id: null,
    instance: 'Local',
    isSelected: false,
    name: ''
  },
  classes: [],
  classesFilters: {
    __typename: 'classesFilters',
    classLocation: 'Local',
    classType: 'All',
    queryString: ''
  }
};

export const resolvers = {
  Mutation: {
    toggleClassSelectionLibrary: (
      _: any,
      variables: { id: string },
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      const id = getCacheKey({
        __typename: defaults.class.__typename,
        id: variables.id
      });

      const classQuery = cache.readQuery({
        query: gql`
          query classSelected($id: String!) {
            class(id: $id) {
              isSelected
            }
          }
        `,
        variables: {
          id: variables.id
        }
      });

      const data = { isSelected: !classQuery.class.isSelected };
      cache.writeData({ id, data });
      return null;
    },
    updateClass: (
      _: any,
      variables: any,
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      /**
       * Store class on client
       */
      const id = `${defaults.class.__typename}:${variables.id}`;
      cache.writeData({
        data: {
          classLocation: variables.classLocation,
          classType: variables.classType,
          id: variables.id,
          instance: variables.instance,
          isSelected: variables.isSelected || false,
          name: variables.name
        },
        id
      });

      /**
       * Update list with classes
       */
      const canvasId = getCacheKey({ __typename: defaults.canvas.__typename });

      const data = cache.readQuery({
        query: gql`
          query classIds {
            canvas @client {
              classIds
            }
          }
        `
      });

      if (!data.canvas.classIds.includes(id)) {
        data.canvas.classIds.push(variables.id);
      }

      cache.writeData({ id: canvasId, data });
      return null;
    },
    updateClassesFilters: (
      _: any,
      variables: IUpdateClassesFiltersVariables,
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      const id = getCacheKey({
        __typename: defaults.classesFilters.__typename
      });
      let data = {};
      if (variables.classLocation) {
        data = { ...data, classLocation: variables.classLocation };
      }
      if (variables.classType) {
        data = { ...data, classType: variables.classType };
      }
      if (typeof variables.queryString !== 'undefined') {
        data = { ...data, queryString: variables.queryString };
      }

      cache.writeData({ id, data });
      return null;
    },
    updateSelectedClasses: (
      _: any,
      variables: { id: string },
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      const id = getCacheKey({ __typename: defaults.canvas.__typename });
      const query = cache.readQuery({
        query: gql`
          query selectedClasses {
            canvas {
              selectedClasses
            }
          }
        `
      });

      const selectedClasses = query.canvas.selectedClasses;
      let data = {};

      if (selectedClasses.includes(variables.id)) {
        data = {
          selectedClasses: selectedClasses.filter(
            (classId: string) => classId !== variables.id
          )
        };
      } else {
        data = {
          selectedClasses: [...selectedClasses, variables.id]
        };
      }

      cache.writeData({ id, data });

      return null;
    }
  }
};
