import React from 'react'

// LOGIN Y USUARIOS
const Login = React.lazy(() => import('./components/login/Login'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserRegister = React.lazy(() => import('./components/users/UserRegister'))
const Users = React.lazy(() => import('./components/users/Users'))
const PetsModule = React.lazy(() => import('./components/pets/PetsModule'))
const RegisterPet = React.lazy(() => import('./components/pets/RegisterPet'))
const MyPets = React.lazy(() => import('./components/pets/MyPets'))
const PetsList = React.lazy(() => import('./components/pets/PetsList'))
const RecoverPassword = React.lazy(() => import('./components/recover_password/RecoverPassword'))
const Register = React.lazy(() => import('./components/register/Register'))

// APPOINTMENTS
const AppointmentPage = React.lazy(() => import('./components/Appointments/AppointmentsPage'))
const AppointmentList = React.lazy(() => import('./components/Appointments/AppointmentList'))

// INVENTORY
const InventoryPage = React.lazy(() => import('./components/Inventory/InventoryPage'))
// 1. IMPORTANTE: Agregamos el componente del Formulario
const InventoryForm = React.lazy(() => import('./components/Inventory/InventoryForm'))

const routes = [
  // LOGIN
  { path: '/', exact: true, name: 'Login', element: Login },
  { path: '/login', name: 'Login', element: Login },

  // PRIVADAS
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users/register', name: 'Register User', element: UserRegister },
  { path: '/users/list', name: 'Users', element: Users },
  { path: '/pets/list', name: 'Pets List', element: PetsList },
  { path: '/pets/mypets', name: 'My Pets', element: MyPets },
  { path: '/pets/register', name: 'Register Pet', element: RegisterPet },
  { path: '/pets', name: 'Pets Management', element: PetsModule },
  { path: '/recover/password', name: 'Recover Password', element: RecoverPassword },
  { path: '/register', name: 'Register', element: Register },

  // APPOINTMENTS
  { path: '/appointments', name: 'Appointments', element: AppointmentPage },
  { path: '/appointments/list', name: 'Appointment List', element: AppointmentList},

  // INVENTORY 
  { path: '/inventory', name: 'Inventory', element: InventoryPage },
  // 2. AGREGAMOS LAS RUTAS FALTANTES:
  { path: '/inventory/add', name: 'Add Product', element: InventoryForm },
  { path: '/inventory/edit/:id', name: 'Edit Product', element: InventoryForm },
]

export default routes