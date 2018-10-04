import * as React from 'react';
import { Section } from 'src/components';

const typenameKey = (key: string) => key !== '__typename';

const Library = (props: any) => (
  <Section>
    Library
    <p>
      <strong>Things</strong>
    </p>
    {Object.keys(props.data.Local.Get.Things)
      .filter(typenameKey)
      .map(key => (
        <p key={key}>{key}</p>
      ))}
    <p>
      <strong>Actions</strong>
    </p>
    {Object.keys(props.data.Local.Get.Things)
      .filter(typenameKey)
      .map(key => (
        <p key={key}>{key}</p>
      ))}
  </Section>
);

export default Library;
