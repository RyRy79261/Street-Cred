import { createStyles, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Theme, WithStyles, withStyles } from '@material-ui/core';
import VoteIcon from '@material-ui/icons/HowToVote';
import FalseIcon from '@material-ui/icons/NotInterested';
import PendingIcon from '@material-ui/icons/AccessTime';
import TrueIcon from '@material-ui/icons/CheckCircle';
import CuratorVoteDialog from './CuratorVote';
import CuratorRequestDialog from './CuratorRequest';
import * as React from 'react';
import * as CuratorActions from '../../actions/curator';
import { Curator } from '../../model/model';

export namespace CuratorTable {
    export interface Props extends WithStyles<typeof styles> {
        curators: Curator[];
        actions: typeof CuratorActions;
        registryName: string;
        back: Function;
    }

    export interface State {
        openRequest: boolean;
        openVote: boolean;
        curator: Curator;
      }
}

class CuratorTable extends React.Component<CuratorTable.Props> {

    constructor(props?: (CuratorTable.Props), context?: any) {
        super(props as any, context);
    }

    state = {
        openRequest: false,
        openVote: false,
        curator: {address: '',
        pending: false,
        validated: false,
        target: '',
        owner: true }
    };

    vote(curator: Curator) {
        this.setState({ openRequest: false, openVote: true, curator: curator});
    }

    render() {
        const { classes, actions } = this.props;

        return (
            
            <Paper className={classes.paper}>
            <CuratorVoteDialog
                actions={actions}
                open={this.state.openVote}
                curator={this.state.curator}
                onClose={() => this.setState({ openRequest: false, openVote: false, curator: {} })}
            />
            <CuratorRequestDialog
                actions={actions}
                registryName={this.props.registryName}
                open={this.state.openRequest}
                onClose={() => this.setState({ openRequest: false, openVote: false, curator: {} })}
            />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">Address</TableCell>
                            <TableCell padding="dense">Status</TableCell>
                            <TableCell padding="dense">Vote</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.curators.map(curator => {
                            return (
                                <TableRow
                                    key={curator.address}
                                    hover
                                >
                                    <TableCell padding="dense">{curator.address}</TableCell>
                                    <TableCell padding="dense">{curator.pending ? <PendingIcon />: curator.validated ? <TrueIcon /> : <FalseIcon />}</TableCell>
                                    <TableCell padding="dense">
                                        <IconButton
                                            aria-label="Vote"
                                            color="default"
                                            onClick={() => this.vote(curator)}
                                            disabled={curator.pending}
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

export default withStyles(styles)<CuratorTable.Props>(CuratorTable);