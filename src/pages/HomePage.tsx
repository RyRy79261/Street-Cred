import { createStyles, Button, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Registry } from '../model/model';
import { RootState } from '../reducers';
import { bindActionCreators } from 'redux';
import * as RegistryActions from '../actions/registry';
import uPortService from '../services/uport.service';


export namespace HomePage {
  export interface Props extends RouteComponentProps<void>, WithStyles<typeof styles> {
    registries: Registry[];
    registryActions: typeof RegistryActions;
  }

  export interface State {
    user : any
  }
}

class HomePage extends React.Component<HomePage.Props> {
 
  state = {
    user : {}
  };

   uportService = new uPortService(); 

  async loginUport () {
    debugger;
    await this.uportService.login();
    this.props.registryActions.getRegistries(this.uportService);
  }

  render() {

    return (
      <div className={this.props.classes.root}>
        <Typography variant="display1" gutterBottom>
          <Button className={this.props.classes.button} variant="raised" color="secondary" onClick={() => this.loginUport()}>
              Login
          </Button>
          
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
    registryActions: bindActionCreators(RegistryActions as any, dispatch)
  };
}

export default (withStyles(styles)<{}>(connect(mapStateToProps, mapDispatchToProps)(HomePage)));
