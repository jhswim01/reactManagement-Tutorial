import React from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Customer from './components/Customer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { style } from '@material-ui/system';
import CustomerAdd from './components/CustomerAdd';
import MonthlyButtons from './components/MonthlyButtons'

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

import {XYPlot, XAxis, YAxis, LabelSeries, VerticalGridLines, HorizontalGridLines, VerticalBarSeries,  VerticalBarSeriesCanvas, LineSeries} from 'react-vis';

import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    width: '100%',
    minWidth: 1080
  },
  paper: {
    marginTop: 18,
    marginLeft: 18,
    marginRight: 18
  },
  button: {
    marginTop: 18,
    marginLeft: 18,
    marginRight: 18
  },
  graphTest:{
    marginLeft: 35,
    marginTop: 18,
    paddingTop: 25 
  },
  maxmin:{
    marginLeft: 35,
    marginTop: 30,
  },
  table: {
  },
  tableHead: {
    fontSize: '1.0rem'
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  grow: {
    flexGrow: 1,
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }
})



class App extends React.Component {

  constructor(props) {
    super(props);
    var today = new Date();
    this.state = {
      customers: '',
      completed: 0,
      searchKeyword: '',
      useCanvas: false,
      cur: '',
      data_rendered: null,
      month: today.getMonth() + 1
    }
  }

  sortCurData = (month) => {
    var raw_data = this.state.cur;
    var sorted_data = [];
    // var sorted_data=[
    //   {x: '8/25', y: 1123},
    //   {x: '8/26', y: 1250},
    //   {x: '8/27', y: 1180}
    // ];;

    for(var i=0; i<raw_data.length; i++) {
    
    if (raw_data[i].MONTH == month)
      sorted_data.unshift({x: raw_data[i].MONTH+'/'+raw_data[i].DAY, y:raw_data[i].CURRENCY});
    console.log(i);
    }
    // var sorted_data=[
    //   {x: raw_data[0].MONTH, y: raw_data[0].CURRENCY},
    //   {x: '8/26', y: 1250},
    //   {x: '8/26', y: 1180}
    // ];;

    return sorted_data;
  }

  calculateDomainRendered = (month) => {
    var sorted_data = this.sortCurData(month);
    
    var sorted_cur = [];
    for (var i=0; i<sorted_data.length; i++){
      sorted_cur.push(sorted_data[i].y);
    }

    var domain_rendered = [];
    var max;
    var min;
    
    min = Math.min.apply(null, sorted_cur)-10;
    max = Math.max.apply(null, sorted_cur)+10;

    domain_rendered.push(min);
    domain_rendered.push(max);
    console.log(domain_rendered);
    return domain_rendered;
  }

  stateRefresh = () => {
    this.setState({
      customers: '',
      completed: 0,
      searchKeyword: ''
    });
    this.callApi()
      .then(res => this.setState({customers: res}))
      .catch(err => console.log(err));
  }


  componentDidMount() {
    // this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then(res => this.setState({customers: res}))
      .catch(err => console.log(err));
    this.callCurApi()
      .then(res => this.setState({cur: res}))
      .catch(err => console.log(err));

    
  }

  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body; 
  }

  callCurApi = async () => {
    const response = await fetch('/api/currency');
    const body = await response.json();
    return body;
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0: completed + 1});
  }

  handleMonthButtonClick(_month) {
    this.setState({
      customers: '',
      completed: 0,
      searchKeyword: '',
      useCanvas: false,
      
      data_rendered: null,
      month: _month
    })
    
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return <Customer stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
      });
    }
    const {useCanvas} = this.state;
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
    const { classes } = this.props;
    const cellList = ['번호', "프로필 이미지", "이름", "생년월일", "성별", "직업", "설정"];
    const data_= [
      {x: '8/25', y: 1123},
      {x: '8/26', y: 1250},
      {x: '8/27', y: 1180}
    ];
    var month = this.state.month;
    var sorted_data = this.state.cur ? this.sortCurData(month) : [];
    var domain_rendered = this.state.cur ? this.calculateDomainRendered(month) : [];

    return (
      <div className={classes.root}>
      
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            환율 조회 서비스
          </Typography>
          
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색하기…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              name = "searchKeyword"
              value = {this.state.searchKeyword}
              onChange={this.handleValueChange}
            />
          </div> */}
          {/* <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              // aria-controls={menuId}
              aria-haspopup="true"
              // onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              // aria-controls={mobileMenuId}
              aria-haspopup="true"
              // onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div> */}
        </Toolbar>
      </AppBar>
      {/* <div className={classes.menu}>
        <CustomerAdd stateRefresh={this.stateRefresh}/>
      </div> */}
      <div className={classes.button}>
      <div>
        <Button color="primary" onClick={() => { this.handleMonthButtonClick(1) }}>
          1월
        </Button>
        <Button color="primary" onClick={() => { this.handleMonthButtonClick(2) }}>
          2월
        </Button>
        <Button color="primary" onClick={() => { this.handleMonthButtonClick(3) }}>
          3월
        </Button>
        <Button color="primary"  onClick={() => { this.handleMonthButtonClick(4) }}>
          4월
        </Button>
        <Button color="primary"  onClick={() => { this.handleMonthButtonClick(5) }}>
          5월
        </Button>
        <Button  color="primary"  onClick={() => { this.handleMonthButtonClick(6) }}>
          6월
        </Button>
        <Button color="primary"  onClick={() => { this.handleMonthButtonClick(7) }}>
          7월
        </Button>
        <Button  color="primary" onClick={() => { this.handleMonthButtonClick(8) }}>
          8월
        </Button>
        <Button  color="primary" onClick={() => { this.handleMonthButtonClick(9) }}>
          9월
        </Button>
        <Button  color="primary" onClick={() => { this.handleMonthButtonClick(10) }}>
          10월
        </Button>
        <Button color="primary"  onClick={() => { this.handleMonthButtonClick(11) }}>
          11월
        </Button>
        <Button color="primary"  onClick={() => { this.handleMonthButtonClick(12) }}>
          12월
        </Button>
      </div>
      </div>
      <Paper className={classes.paper}>
        {this.state.cur ? 
          <div className={classes.graphTest}>
          <XYPlot
            width={1800}
            height={500}
            yDomain={domain_rendered}
            xType="ordinal">        
          <HorizontalGridLines />
          <VerticalBarSeries
            data={sorted_data}/>
          <LabelSeries
              data={sorted_data.map(obj => {
                  return { ...obj, label: obj.y.toString(), style: {fontSize: 13} }
              })}
              labelAnchorX="middle"
              labelAnchorY="text-after-edge"
                  />
          <XAxis />
          <YAxis />
          </XYPlot>
        </div> :
        <TableRow>
        <TableCell colSpan="6" align="center">
           <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
        </TableCell>
        </TableRow>
        }
      
          {/* <Table className={classes.table}>
            <TableHead>
              {cellList.map(c => {
                return <TableCell className={classes.tableHead}>{c}</TableCell>
              })}
            </TableHead>
            <TableBody>              
                {this.state.customers ?
                  filteredComponents(this.state.customers) : 
                  <TableRow>
                    <TableCell colSpan="6" align="center">
                       <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
                    </TableCell>
                  </TableRow>
                  }  
            </TableBody>
          </Table> */}
    </Paper >
      <div className={classes.maxmin}>
        {month}월 최고 환율 : {domain_rendered[1]-10}
      </div>
      <div className={classes.maxmin}>
        {month}월 최저 환율 : {domain_rendered[0]+10}
      </div>
    </div>
    )
  }
}

export default withStyles(styles)(App);
