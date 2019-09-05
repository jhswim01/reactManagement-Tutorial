import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// const useStyles = makeStyles(theme => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   input: {
//     display: 'none',
//   },
// }));



class MonthlyButtons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cur_data: null
        }
    }

    handleClick = () => {


        this.setState({
            cur_data: null
        })
    }
    

    render() {
        // const { classes } = this.props;
        return (
            <div>
              <Button variant="outlined" color="primary" >
                월
              </Button>              
            </div>
          );
    }
}


export default MonthlyButtons;