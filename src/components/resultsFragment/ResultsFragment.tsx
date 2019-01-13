import * as React from 'react';
import client from 'src/apollo/apolloClient';
import { ClassId } from 'src/components/canvas/Canvas';
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

  public async fetchMetaType(typename: string): Promise<any> {
    return await client.query({
      query: META_TYPE_QUERY,
      variables: { typename }
    });
  }

  public async addFragment() {
    const { addFragment, classObj, cleanString } = this.props;
    const { classType, id, instance, filters, name } = classObj;

    if (!classObj) {
      return null;
    }
    const path = [classType, name];
    const where = createGqlFilters(path, JSON.parse(filters));

    const reference = cleanString(id);
    const typename = instance === 'Local' ? name : `${instance}${name}`;
    const metaQuery = await this.fetchMetaType(typename);

    if (!metaQuery.data.__type) {
      // tslint:disable-next-line:no-console
      console.log(`Missing meta data for ${name}`);
      return null;
    }

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
      classLocation: instance,
      className: name,
      classType,
      properties,
      reference,
      type: 'Get',
      where
    });

    addFragment(id, { queryString });

    return null;
  }

  public render() {
    return null;
  }
}

export default ResultsFragment;
