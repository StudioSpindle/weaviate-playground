import * as React from 'react';
import { ClassId } from 'src/components/canvas/Canvas';
import { IWeaviateLocalGetWhereInpObj } from 'src/types';
import { createGqlFilters, createGqlFragment } from 'src/utils';
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

  public addFragment() {
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

    const queryString = createGqlFragment({
      classLocation,
      className: name,
      classType,
      properties: 'uuid, name',
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
