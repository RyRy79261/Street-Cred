import { Button, createStyles, Dialog, DialogActions, DialogTitle, TextField, Theme, WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import * as RegistryActions from '../../actions/registry';

export namespace RegistryAdd {
    export interface Props extends WithStyles<typeof styles> {
        actions: typeof RegistryActions;
        open: boolean;
        onClose: () => void;
    }

    export interface State {
        newRegistryName: string;
    }
}

class RegistryAdd extends React.Component<RegistryAdd.Props> {

    state = {
        name: ''
    };

    static getDerivedStateFromProps(nextProps: Readonly<RegistryAdd.Props>, prevState: Readonly<RegistryAdd.State>) {
        return { open: nextProps.open, newRegistryName: prevState.newRegistryName };
    }

    handleClose = () => {
        this.props.actions.addRegistry(this.state.name);
        this.props.onClose();

        this.setState({ newRegistryName: '' });
    };

    handleChange = (name: string) => (event: any) => {
        this.setState({
            newRegistryName: event.target.value,
        });
    };

    render() {

        return (
            <Dialog open={this.props.open} onClose={this.handleClose}>
                <DialogTitle>Add a new Registry</DialogTitle>
                <TextField
                    id="multiline-flexible"
                    multiline
                    value={this.state.name}
                    onChange={this.handleChange('newRegistryName')}
                    className={this.props.classes.textField}
                />
                <DialogActions>
                    <Button color="primary" onClick={this.handleClose}>
                        OK
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

export default withStyles(styles)<RegistryAdd.Props>(RegistryAdd);