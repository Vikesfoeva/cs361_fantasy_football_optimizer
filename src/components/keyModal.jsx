import React, { Component } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import BlockIcon from '@mui/icons-material/Block';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';

class KeyModal extends Component {  
    constructor(props) {
        super(props);
        this.state = {
          open: false
        };
      }
    render() { 
        const modalStyle = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          };

        return (
            <div>
                <Button onClick={() => this.setState({open: true})}
                    variant='contained'
                    size="small"
                    color='success'
                    endIcon={<KeyIcon />}
                >
                    Actions Legend
                </Button>
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={this.state.open}
                onClose={() => this.setState({open: false})}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
                >
                    <Fade in={this.state.open}>
                        <Box sx={modalStyle}>
                            <Typography id="transition-modal-title" variant="h6" component="h2" align='center'>
                                Actions Legend
                            </Typography>
                            <Stack direction="column" spacing={1}>
                                <Chip icon={<AddIcon />} 
                                    align='left'
                                    label="Click to manually add a player to a lineup." 
                                />
                                <Chip icon={<BlockIcon />} 
                                    label="Click to ban a player from lineup optimization." 
                                />
                                <Chip icon={<RadioButtonUncheckedIcon />} 
                                    label="Click to unban a player into lineup optimization." 
                                />
                                <Chip icon={<LockOpenIcon />} 
                                    label="Click to lock a player into lineup optimization." 
                                />
                                <Chip icon={<LockIcon />} 
                                    label="Click to unlock a player from lineup optimization." 
                                />
                                <Chip icon={<ClearIcon />} 
                                    label="Removes a player from the lineup." 
                                />
                            </Stack>       
                        </Box>
                    </Fade>
                </Modal>
            </div>
          );
    }
}
 
export default KeyModal;
