import React, { Component } from 'react';
import './App.css';
import Header from './components/header/header'
import Footer from './components/footer/footer';
import NoteList from './components/notes/noteList';
import axios from 'axios';
import NoteView from './components/notes/noteView';
import EditNote from './components/notes/editNote';
import { Route }  from 'react-router-dom';
import { Wrapper } from './style/style';
import Side from './components/side/side';
import Form from './components/form/form';
import MyNotes from './components/notes/myNotes';
import Login from './components/auth/login';
import Register from './components/auth/register';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      notes:[],
      id:'all',
      tags:['Obed'],
      title:'',
      textBody:''
    }
  }

  clickHandler = id =>{
    this.setState({
      id:id
    })
  }

  handleChange =event =>{
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    const url = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('jwt');
    const options = {
      headers: {
          Authorization: token
      }
    }
    axios
    .post(`${url}`,{
        title: this.state.title,
        textBody: this.state.textBody,
    },options)
    .then(res =>{
      this.setState({id: res.data.success})
      this.props.history.push('/notes');
      window.location.reload();
    })
    .catch(err => console.log(err))
    this.setState({
      title:'',
      textBody:''
    });
  }

  deleteNote = e => {
    e.preventDefault();
    console.log(this.state.id);
    const url = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('jwt');
    const options = {
      headers: {
          Authorization: token
      }
    }
    axios
      .delete(`${url}/${this.state.id}`, options)
      .then(() => {
        this.setState({
          notes:this.state.notes
        });
        window.location.reload();
        this.props.history.push('/notes');
      })
      .catch(err => console.log(err));
      
  };

  componentDidMount(){
    const url = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('jwt');
    const options = {
      headers: {
          Authorization: token
      }
    }
    axios
    .get(`${url}`, options)
    .then(res => this.setState({
      notes:res.data
    }))
    .catch(err =>{
      if(err.msg ==="invalid token" ){
        this.props.history.push('/')
      }
    })
  }

  render() {
    return (
    <>
    <Header/>
    <Wrapper>
    <Side/>
    <Route exact path='/' component ={ Login }/>
    <Route exact path='/register' component ={ Register }/>
    <Route exact path="/notes" render={(props) => <NoteList {...props} notes={this.state.notes} getId={this.clickHandler} id={this.state.id}/>}/>
    <Route exact path="/form" render ={(props) => <Form {...props}  update={this.handleChange} submit={this.handleSubmit} />}/>
    <Route exact path='/noteView/:id' render={(props) => <NoteView {...props} notes={this.state.notes} delete={this.deleteNote}/>}/>
    <Route exact path='/noteView/editNote/:id' component={EditNote}/>
    <Route exact path='/myNotes'component ={MyNotes}/>
    </Wrapper>
    <Footer/>
    </>
    );
  }
}

export default App;
