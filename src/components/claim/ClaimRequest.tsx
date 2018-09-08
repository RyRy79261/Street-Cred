import { Button, createStyles, Dialog, DialogActions, DialogTitle, TextField, Theme, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import * as ClaimActions from '../../actions/claim';
import { ClaimRace } from '../../model/model';

export namespace ClaimRequest{
    export interface Props extends WithStyles<typeof styles> {
        actions: typeof ClaimActions;
        registryName: string;
        open: boolean;
        onClose: () => void;
    }

    export interface State {
        claim: ClaimRace;
    }
}

class ClaimRequest extends React.Component<ClaimRequest.Props> {

    state = {
        claim: {}
    };

    static getDerivedStateFromProps(nextProps: Readonly<ClaimRequest.Props>, prevState: Readonly<ClaimRequest.State>) {
        return { open: nextProps.open, claim: prevState.claim };
    }
    cancel = () => {
        this.props.onClose();
    };

    handleClose = () => {
        this.setState({
            claim: this.props.claim
        });

        this.props.actions.makeClaim(this.props.claim);
        this.props.onClose();

        this.setState({ claim: {} });
    };

    handleChange = (name: string) => (event: any) => {
        this.setState({
            claim: {statement : event.target.value}
        });
    };

    render() {

        return (
            <Dialog open={this.props.open} onClose={this.cancel}>
                <DialogTitle>Request claim to "{this.props.registryName}"</DialogTitle>
                <TextField
                    id="multiline-flexible"
                    multiline
                    value={this.state.claim.statement}
                    onChange={this.handleChange('statement')}
                    className={this.props.classes.textField}
                />
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

export default withStyles(styles)<ClaimRequest.Props>(ClaimRequest);