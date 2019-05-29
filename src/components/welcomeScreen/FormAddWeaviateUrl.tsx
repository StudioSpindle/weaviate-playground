import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import React from 'react';

/**
 * Types
 */
export interface IFormAddWeaviateUrlProps extends WithStyles<typeof styles> {}

/**
 * Styles
 */
const styles = (theme: Theme) => createStyles({});

/**
 * Component
 */
const FormAddWeaviateUrl: React.SFC<IFormAddWeaviateUrlProps> = ({}) => {
  return (
    <form>
      <FormControl margin="normal" required={true} fullWidth={true}>
        <InputLabel htmlFor="weaviateUri">Weaviate URL</InputLabel>
        <Input
          name="weaviateUri"
          type="text"
          id="weaviateUri"
          autoComplete="weaviateUri"
        />
      </FormControl>
      <Button
        id="connectButton"
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        size="small"
      >
        Connect Weaviate
      </Button>
    </form>
  );
};

export default withStyles(styles)(FormAddWeaviateUrl);
