import { Button, createStyles, Dialog, DialogActions, DialogTitle, TextField, Theme, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import * as ClaimActions from '../../actions/claim';
import { ClaimRace, Vote } from '../../model/model';

export namespace ClaimVote{
    export interface Props extends WithStyles<typeof styles> {
        actions: typeof ClaimActions;
        open: boolean;
        claim: ClaimRace;
        onClose: () => void;
    }

    export interface State {
        vote: Vote;
    }
}

class ClaimVote extends React.Component<ClaimVote.Props> {

    state = {
        vote: {}
    };

    static getDerivedStateFromProps(nextProps: Readonly<ClaimVote.Props>, prevState: Readonly<ClaimVote.State>) {
        return { open: nextProps.open, vote: prevState.vote };
    }
    cancel = () => {
        this.props.onClose();
    };

    handleClose = (against: boolean) => {

        this.setState({
            vote: { against: against, target: this.props.claim.address }
        });

        this.props.actions.voteOnClaim(this.state.vote, this.props.claim);
        this.props.onClose();

        this.setState({ vote: {} });
    };

    render() {

        return (
            <Dialog open={this.props.open} onClose={this.cancel}>
                <DialogTitle>Claim: "{this.props.claim.statement}"</DialogTitle>
               
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

export default withStyles(styles)<ClaimVote.Props>(ClaimVote);