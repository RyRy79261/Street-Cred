import { Button, createStyles, Dialog, DialogActions, DialogTitle, TextField, Theme, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import * as CuratorActions from '../../actions/curator';
import { Curator, Vote } from '../../model/model';

export namespace CuratorVote {
    export interface Props extends WithStyles<typeof styles> {
        actions: typeof CuratorActions;
        open: boolean;
        curator: Curator;
        onClose: () => void;
    }

    export interface State {
        vote: Vote;
    }
}

class CuratorVote extends React.Component<CuratorVote.Props> {

    state = {
        vote: {}
    };

    static getDerivedStateFromProps(nextProps: Readonly<CuratorVote.Props>, prevState: Readonly<CuratorVote.State>) {
        return { open: nextProps.open, vote: prevState.vote };
    }
    cancel = () => {
        this.props.onClose();
    };

    handleClose = (against: boolean) => {

        this.setState({
            vote: { against: against, target: this.props.curator.address }
        });

        this.props.actions.voteCurator(this.state.vote, this.props.curator);
        this.props.onClose();

        this.setState({ vote: {} });
    };

    render() {

        return (
            <Dialog open={this.props.open} onClose={this.cancel}>
                <DialogTitle>Curator: "{this.props.claim.address}"</DialogTitle>
               
                <DialogActions>
                    <Button color="primary" onClick={this.handleClose(false)}>
                        Approve
                    </Button>
                    <Button color="primary" onClick={this.handleClose(true)}>
                        Deny
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

export default withStyles(styles)<CuratorVote.Props>(CuratorVote);