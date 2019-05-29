import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import React from 'react';

export interface IStateMessageProps {
  state: string;
  message?: string;
}

export default class StateMessage extends React.Component<IStateMessageProps> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const { state, message } = this.props;
    return (
      <div>
        {state === 'loading' && <CircularProgress />}
        {state === 'error' && (
          <React.Fragment>
            {message && (
              <Typography id="errorMessage" color="error">
                {message}
              </Typography>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

// export default StateMessage;
