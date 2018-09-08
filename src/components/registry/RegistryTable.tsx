import { Checkbox, createStyles, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Theme, WithStyles, withStyles } from '@material-ui/core';
import ListIcon from '@material-ui/icons/Visibility';
import * as React from 'react';
import * as RegistryActions from '../../actions/registry';
import { Registry } from '../../model/model';

export namespace RegistryTable {
    export interface Props extends WithStyles<typeof styles> {
        registries: Registry[];
        actions: typeof RegistryActions;
    }
}

class RegistryTable extends React.Component<RegistryTable.Props> {

    constructor(props?: (RegistryTable.Props), context?: any) {
        super(props as any, context);
    }

    onRowClick(registry: Registry) {
       
    }

    openClaims(registry: Registry) {
       
    }

    openCurators(registry: Registry) {
       
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">Name</TableCell>
                            <TableCell padding="dense">Curatable</TableCell>
                            <TableCell padding="dense">Claims</TableCell>
                            <TableCell padding="dense">Curators</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.registries.map(n => {
                            return (
                                <TableRow
                                    key={n.address}
                                    hover
                                    onClick={event => this.onRowClick(n)}
                                >
                                    <TableCell padding="dense">{n.name}</TableCell>
                                    <TableCell padding="dense"> <Checkbox checked={n.amCurator} disabled="true"/></TableCell>
                                    <TableCell padding="dense">
                                        <IconButton
                                            aria-label="View Claims"
                                            color="default"
                                            onClick={() => this.openClaims(n)}
                                        >
                                            <ListIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell padding="dense">
                                        <IconButton
                                            aria-label="View Curators"
                                            color="default"
                                            onClick={() => this.openCurators(n)}
                                        >
                                            <ListIcon />
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

export default withStyles(styles)<RegistryTable.Props>(RegistryTable);