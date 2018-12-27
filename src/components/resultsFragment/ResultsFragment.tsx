import * as React from 'react';
import client from 'src/apolloClient';
import { ClassId } from 'src/components/canvas/Canvas';
import { IWeaviateLocalGetWhereInpObj } from 'src/types';
import { createGqlFilters, createGqlFragment } from 'src/utils';
import { META_TYPE_QUERY } from '../filters/queries';
import { IFragment } from '../resultsContainer/ResultsContainer';

interface IResultsFragmentProps {
  classObj: {
    id: ClassId;
    classLocation: string;
    classType: string;
    instance: string;
    filters: string;
    name: string;
  };
  selectedClassId: string;
  cleanString(textString: string): string;
  addFragment(classId: ClassId, fragment: IFragment): void;
  removeFragment(classId: ClassId): void;
}

class ResultsFragment extends React.Component<IResultsFragmentProps> {
  constructor(props: IResultsFragmentProps) {
    super(props);
    this.state = {
      classObj: undefined
    };
  }

  public componentDidMount() {
    this.addFragment();
  }

  public componentDidUpdate(prevProps: IResultsFragmentProps) {
    const { classObj } = this.props;
    if (classObj.filters !== prevProps.classObj.filters) {
      this.addFragment();
    }
  }

  public componentWillUnmount() {
    const { classObj, removeFragment } = this.props;
    removeFragment(classObj.id);
  }

  public async fetchMetaType(): Promise<any> {
    const { classObj } = this.props;

    return await client.query({
      query: META_TYPE_QUERY,
      variables: { typename: classObj.name }
    });
  }

  public async addFragment() {
    const { addFragment, classObj, cleanString } = this.props;
    const { classLocation, classType, id, filters, name } = classObj;

    if (!classObj) {
      return null;
    }
    const path = [classType, name];
    const where = createGqlFilters(
      path,
      JSON.parse(filters)
    ) as IWeaviateLocalGetWhereInpObj;

    const reference = cleanString(id);

    const metaQuery = await this.fetchMetaType();

    const createProperties = (fields: any) =>
      fields
        .filter(
          (field: any) =>
            field.type.name === 'String' ||
            field.type.name === 'Int' ||
            field.type.name === 'Boolean'
        )
        .map((field: any) => field.name)
        .join();

    const properties = createProperties(metaQuery.data.__type.fields);

    const queryString = createGqlFragment({
      classLocation,
      className: name,
      classType,
      properties,
      reference,
      type: 'Get'
    });

    addFragment(id, { queryString, where });

    return null;
  }

  public render() {
    return null;
  }
}

export default ResultsFragment;
