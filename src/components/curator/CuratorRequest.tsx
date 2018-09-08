import { Button, createStyles, Dialog, DialogActions, DialogTitle, TextField, Theme, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import * as CuratorActions from '../../actions/curator';
import { Curator } from '../../model/model';

export namespace CuratorRequest{
    export interface Props extends WithStyles<typeof styles> {
        actions: typeof CuratorActions;
        registryName: string;
        open: boolean;
        onClose: () => void;
    }

    export interface State {
        curator: Curator;
    }
}

class CuratorRequest extends React.Component<CuratorRequest.Props> {

    state = {
        curator: {}
    };

    static getDerivedStateFromProps(nextProps: Readonly<CuratorRequest.Props>, prevState: Readonly<CuratorRequest.State>) {
        return { open: nextProps.open, claim: prevState.curator };
    }
    cancel = () => {
        this.props.onClose();
    };

    handleClose = () => {
        this.setState({
            claim: this.props.curator
        });

        this.props.actions.applyToCurate(this.props.curator);
        this.props.onClose();

        this.setState({ curator: {} });
    };

    render() {

        return (
            <Dialog open={this.props.open} onClose={this.cancel}>
                <DialogTitle>Request to Curate to "{this.props.registryName}"</DialogTitle>
                <DialogActions>
                    <Button color="primary" onClick={this.handleClose}>
                        Submit
            </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const styles = (theme: Theme) => createStyles({
    textField: {
        width: '80%',
        margin: 20
    }
});

export default withStyles(styles)<CuratorRequest.Props>(CuratorRequest);