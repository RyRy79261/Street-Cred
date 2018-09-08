import { createStyles, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Registry } from '../model/model';
import { RootState } from '../reducers';

export namespace HomePage {
  export interface Props extends RouteComponentProps<void>, WithStyles<typeof styles> {
    registries: Registry[];
  }
}

class HomePage extends React.Component<HomePage.Props> {

  render() {
    return (
      <div className={this.props.classes.root}>
        <Typography variant="display1" gutterBottom>
          Uport QR Code
        </Typography>
      </div>
    );
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

function mapStateToProps(state: RootState) {
  return {
    registries: state.registries
  };
}

export default (withStyles(styles)<{}>(connect(mapStateToProps)(HomePage)));
