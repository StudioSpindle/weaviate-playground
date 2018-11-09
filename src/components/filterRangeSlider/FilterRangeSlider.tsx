import Grid from '@material-ui/core/Grid';
import { withTheme } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export interface IRangeSliderProps {
  allowCross?: boolean;
  filterMutation: (data: any) => void;
  filterValue?: {
    min: number;
    max: number;
  };
  max: number;
  min: number;
  theme: Theme;
}

class RangeSlider extends React.Component<IRangeSliderProps> {
  public handleChange = (value: any) => {
    const { filterMutation } = this.props;
    filterMutation({ variables: { value } });
  };

  public render() {
    const { allowCross = false, filterValue, min, max, theme } = this.props;

    return (
      <Grid
        container={true}
        spacing={24}
        alignItems="center"
        justify="space-between"
      >
        <Grid item={true}>
          <Typography>{min}</Typography>
        </Grid>
        <Grid item={true} xs={7}>
          <Range
            allowCross={allowCross}
            max={max}
            min={min}
            defaultValue={[min, max]}
            value={filterValue}
            onChange={this.handleChange}
            trackStyle={[{ backgroundColor: theme.palette.primary.main }]}
            handleStyle={[
              { borderColor: theme.palette.primary.main },
              { borderColor: theme.palette.primary.main }
            ]}
          />
        </Grid>
        <Grid item={true}>
          <Typography>{max}</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withTheme()(RangeSlider);
