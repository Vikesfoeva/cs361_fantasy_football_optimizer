import React, { Component } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';

class LearnMoreModal extends Component {  
    constructor(props) {
        super(props);
        this.state = {
          open: false
        };
      }
    render() { 
        const style = {
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
                    color='success'
                    endIcon={<HelpIcon />}
                >
                    Learn More
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
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h6" component="h2" align='center'>
                                Learn More
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                This website allows a user to optimize their fantasy football line ups by aggregating 
                                data, helping to run optimizations, and letting them visualize different outcomes.  
                                The user can select which week of games they want to choose from, which game that 
                                weekand then use the optimization, and visualization tools on the right to help them 
                                arrive at theright decisions.Users will be able be able to flexibly, change, undo, 
                                and export their lineups.
                            </Typography>
                        </Box>
                    </Fade>
                </Modal>
            </div>
          );
    }
}
 
export default LearnMoreModal;
