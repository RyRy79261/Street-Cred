import { Button, createStyles, Grid, Theme, Typography, WithStyles, withStyles, withWidth } from '@material-ui/core';
import { WithWidthProps } from '@material-ui/core/withWidth';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import * as RegistryActions from '../actions/registry';
import RegistryTable from '../components/registry/RegistryTable';
import CuratorTable from '../components/curator/CuratorTable';
import ClaimTable from '../components/claim/ClaimTable';
import RegistryAddDialog from '../components/registry/RegistryAdd';
import { Registry } from '../model/model';
import { RootState } from '../reducers';
import { isSmartphone } from '../responsive';

export namespace RegistryPage {
  export interface Props extends RouteComponentProps<void>, WithStyles<typeof styles>, WithWidthProps {
    registries: Registry[];
    actions: typeof RegistryActions;
  }

  export interface State {
    open: boolean;
  }
}

class RegistryPage extends React.Component<RegistryPage.Props, RegistryPage.State> {
  state = {
    open: false,
    showRegistries: true,
    showCurators: false,
    showClaims: false,
  };

  handleChange = (eventName: string) => {
    switch(eventName){
      case "back": {
        this.setState({
          open: false,
          showRegistries: true,
          showCurators: false,
          showClaims: false,
      });
      }
      case "showCurators": {
        this.setState({
          open: false,
          showRegistries: false,
          showCurators: true,
          showClaims: false,
      });
      }
      case "showClaims": {
        this.setState({
          open: false,
          showRegistries: false,
          showCurators: false,
          showClaims: true,
      });
      }
    }
  };

  render() {
    const { classes, actions, registries, width } = this.props;

    let tableView;

    if(this.state.showRegistries){
      tableView = <RegistryTable registries={registries} actions={actions} back={this.handleChange} openList={this.handleChange} />;
    }
    else if(this.state.showCurators){
      tableView = <CuratorTable registries={registries} actions={actions} back={this.handleChange}  />;
    }
    else if(this.state.showClaims){
      tableView = <ClaimTable registries={registries} actions={actions} back={this.handleChange}  />;
    }

    return (

      <Grid
        container
        className={isSmartphone(width) ? classes.mobileRoot : classes.root}
        alignItems={'flex-start'}
        justify={'flex-start'}
      >
        <RegistryAddDialog
          actions={actions}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        />
        <Grid item xs={12}>
          <Typography variant="display1" gutterBottom>
            Registries
        </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button className={classes.button} variant="raised" color="secondary" onClick={this.handleAddRegistry}>
            Add Registry
        </Button>
        </Grid>
        <Grid item xs={12}>
         {tableView}
        </Grid>
      </Grid>
    );
  }

  handleAddRegistry = () => this.setState({ open: true,
    showRegistries: true,
    showCurators: false,
    showClaims: false });

}

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing.unit * 10,
  },

  mobileRoot: {
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
  },

  button: {
    marginBottom: 15,
  },
});

function mapStateToProps(state: RootState) {
  return {
    registries: state.registries
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(RegistryActions as any, dispatch)
  };
}

export default (withStyles(styles)<{}>(connect(mapStateToProps, mapDispatchToProps)(withWidth()(RegistryPage))));
