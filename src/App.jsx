import './App.css'
import Home from './pages/Hogar/Hogar';
import Actividad from './pages/Actividad/Actividad';
import Transacciones from './pages/Transacciones/Transacciones';
import { Router } from './Router';
import { NavBar } from './components/NavBar';
import { Component } from 'react';

const routes = [
  {
    path: '/',
    Component: Home
  },
  {
    path: '/transacciones',
    Component: Transacciones
  },
  {
    path: '/actividad',
    Component: Actividad
  }
]




function App(){
  return (
    <>
      <main>
        <Router routes={routes} defaultComponent={() => <h1>Error 404</h1>}/>
      </main>
      <NavBar />
    </>
  )
}


export default App;