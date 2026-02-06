import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilGroup,
  cilHeart,
  cilList,
  cilNotes,
  cilPaw,
  cilPencil,
  cilPlus,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUserFollow,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Management',
  },

  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Register User',
        to: '/users/register',
        icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Users List',
        to: '/users/list',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
    ],
  },
    {
  component: CNavGroup,
  name: 'Pets',
  icon: <CIcon icon={cilHeart} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Register Pet',
      to: '/pets/register',
      icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'My Pets',
      to: '/pets/mypets',
      icon: <CIcon icon={cilPaw} customClassName="nav-icon" />,
    },
    
    {
      component: CNavItem,
      name: 'Pets List',
      to: '/pets/list',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
  ],
},
  {

    component:CNavItem,
        name:'Appointment',
        to:'/appointments',
        icon:<CIcon icon={cilNotes} customClassName="nav-icon" />,
  }, 

    {component:CNavItem,
        name:'Inventory',
        to:'/Inventory',
        icon:<CIcon icon={cilCalculator} customClassName="nav-icon" />,
    },
]

export default _nav
