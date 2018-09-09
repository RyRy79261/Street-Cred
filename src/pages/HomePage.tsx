import { createStyles, Button, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Registry } from '../model/model';
import { RootState } from '../reducers';
import { Connect, SimpleSigner } from 'uport-connect';


export namespace HomePage {
  export interface Props extends RouteComponentProps<void>, WithStyles<typeof styles> {
    registries: Registry[];
  }

  export interface State {
    creds : any
  }
}

class HomePage extends React.Component<HomePage.Props> {
 
  state = {
    creds : {}
  };

  uportService = new Connect('CCR Manager - StreetCred', {
    clientId: '2ozRcEoFKBLthSH5e9cfs4jX3vYgLjZupXM',
    network: 'rinkeby',
    signer: SimpleSigner('a314950dfc65040ba288691c1031151d5fbb49080390106b77ad7c18b8a376aa')
  });

  async login() {
    const credentials = await this.uportService.requestCredentials({
        requested: ['name', 'phone', 'country'],
        notifications: true // We want this if we want to recieve credentials
    });

    this.setState({creds : credentials})
    return credentials;
}
  async loginUport (uportService : any){
    debugger;
    await this.login();
  }

  render() {
    const uportService = this.uportService;
    return (
      <div className={this.props.classes.root}>
        <Typography variant="display1" gutterBottom>
          <Button className={this.props.classes.button} variant="raised" color="secondary" onClick={() => this.loginUport(uportService)}>
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

export default (withStyles(styles)<{}>(connect(mapStateToProps)(HomePage)));
