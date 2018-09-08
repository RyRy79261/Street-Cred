import { createStyles, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Theme, WithStyles, withStyles } from '@material-ui/core';
import VoteIcon from '@material-ui/icons/HowToVote';
import FalseIcon from '@material-ui/icons/NotInterested';
import TrueIcon from '@material-ui/icons/CheckCircle';
import ClaimVoteDialog from './ClaimVote';
import * as React from 'react';
import * as ClaimActions from '../../actions/claim';
import { ClaimRace, ClaimSet, ClaimList } from '../../model/model';

export namespace ClaimTable {
    export interface Props extends WithStyles<typeof styles> {
        claimList: ClaimList,
        actions: typeof ClaimActions;
    }

    export interface State {
        open: boolean;
      }
}

class ClaimTable extends React.Component<ClaimTable.Props> {

    constructor(props?: (ClaimTable.Props), context?: any) {
        super(props as any, context);
    }

    state = {
        open: false,
        claim: {}
    };

    vote(claim: ClaimRace) {
        this.setState({ open: true , claim: claim});
    }

    render() {
        const { classes, actions } = this.props;

        return (
            
            <Paper className={classes.paper}>
            <ClaimVoteDialog
            actions={actions}
            open={this.state.open}
            claim={this.state.claim}
            onClose={() => this.setState({ open: false })}
          />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">Address</TableCell>
                            <TableCell padding="dense">Statement</TableCell>
                            <TableCell padding="dense">Status</TableCell>
                            <TableCell padding="dense">Vote</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.claimList.claimRaces.map(claimRace => {
                            return (
                                <TableRow
                                    key={claimRace.address}
                                    hover
                                >
                                    <TableCell padding="dense">{claimRace.address}</TableCell>
                                    <TableCell padding="dense">{claimRace.statement}</TableCell>
                                    <TableCell padding="dense">Pending</TableCell>
                                    <TableCell padding="dense">
                                        <IconButton
                                            aria-label="Vote"
                                            color="default"
                                            onClick={() => this.vote(claimRace)}
                                        >
                                            <VoteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {this.props.claimList.claimSets.map(claimSet => {
                            return (
                                <TableRow
                                    key={claimSet.address}
                                    hover
                                >
                                    <TableCell padding="dense">{claimSet.issuer}</TableCell>
                                    <TableCell padding="dense">{claimSet.statement}</TableCell>
                            <TableCell padding="dense">{claimSet.value == 0 ? <FalseIcon /> : <TrueIcon />}</TableCell>
                                    <TableCell padding="dense">
                                        <IconButton
                                            aria-label="Vote"
                                            color="default"
                                            onClick={() => this.vote(claimSet)}
                                            disabled="true"
                                        >
                                            <VoteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

const styles = (theme: Theme) => createStyles({
    paper: {
        width: '100%',
        minWidth: 260,
        display: 'inline-block'
    },
    table: {
        width: '100%'
    },
});

export default withStyles(styles)<ClaimTable.Props>(ClaimTable);