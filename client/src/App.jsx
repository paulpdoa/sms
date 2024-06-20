import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Parents from "./pages/Parents";
import Library from "./pages/Library";
import Account from "./pages/Account";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import NewStudent from "./pages/Registrar/NewStudent";
import EditStudent from "./pages/Registrar/EditStudent";
import MasterLayout from "./layouts/MasterLayout";
import Religion from "./pages/SuperAdmin/Religion";
import Nationality from "./pages/SuperAdmin/Nationality";
import Gender from "./pages/SuperAdmin/Gender";
import Department from "./pages/SuperAdmin/Department";
import Section from "./pages/SuperAdmin/Section";
import GradeLevel from "./pages/SuperAdmin/GradeLevel";
import Requirements from "./pages/SuperAdmin/Requirements";
import UserRoles from "./pages/SuperAdmin/UserRoles";
import SchoolYear from "./pages/SuperAdmin/SchoolYear";
import NewTeacher from "./pages/Teacher/NewTeacher";
import SchoolAdmin from './layouts/SchoolAdmin';
import Strands from "./pages/SuperAdmin/Strands";
import Textbook from "./pages/SuperAdmin/Textbook";
import PaymentTerm from "./pages/SuperAdmin/PaymentTerm";
import PaymentPenalty from "./pages/SuperAdmin/PaymentPenalty";
import PaymentSchedule from "./pages/SuperAdmin/PaymentSchedule";
import Admission from './pages/Registrar/Admission';
import FeeCategory from "./pages/SuperAdmin/FeeCategory";
import FeeCode from "./pages/SuperAdmin/FeeCode";
import NewParent from "./pages/Registrar/NewParent";

function App() {

  const userToken = localStorage.getItem('userToken');
  const role = localStorage.getItem('role');

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/login' element={userToken ? <Navigate to='/' /> : <Login />} />

        <Route element={!userToken ? <Navigate to='/login' /> : <DashboardLayout />}>
          <Route path='/' element={<Dashboard />} />

          <Route path='/students' element={<Students />} />
          <Route path='/admission' element={<Admission />} />
          <Route path='/registrar' element={<Registrar />}>
            <Route path='new-student' element={<NewStudent />} />
            <Route path='edit-student/:id' element={<EditStudent />} />  
            <Route path='new-parent' element={<NewParent />} />
          </Route>

          {/* For Super admin */}
          <Route path='/master' element={role === 'Super Admin' && <MasterLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='religion' element={<Religion />} />
            <Route path='nationality' element={<Nationality />} />
            <Route path='gender' element={<Gender />} />
            <Route path='departments' element={<Department />} />
            <Route path='sections' element={<Section />} />
            <Route path='grade-levels' element={<GradeLevel />} />
            <Route path='requirements' element={<Requirements />} />
            <Route path='user-roles' element={<UserRoles />} />
            <Route path='students' element={<Students />} />
            <Route path='school-year' element={<SchoolYear />} />
            <Route path='teachers' element={<Teachers />} />
            <Route path='users' element={<Users />} />
            <Route path='strands' element={<Strands />} />
            <Route path='text-books' element={<Textbook />} />
            <Route path='payment-terms' element={<PaymentTerm />} />
            <Route path='payment-penalty' element={<PaymentPenalty />} />
            <Route path='payment-schedule' element={<PaymentSchedule />} />
            <Route path='admission' element={<Admission />} />
            <Route path='fee-category' element={<FeeCategory />} />
            <Route path='fee-code' element={<FeeCode />} />
            <Route path='parents' element={<Parents />} />
          </Route>

          <Route path='/teachers' element={<Teachers />} />
          <Route path='/strands' element={<Strands />} />

          <Route path='/school-admin' element={role === 'School Admin' && <SchoolAdmin />}>
            <Route path='new-teacher' element={<NewTeacher />} />
          </Route>

          <Route path='/parents' element={<Parents />} />
          <Route path='/library' element={<Library />} />
          <Route path='/account' element={<Account />} />
          <Route path='/users' element={<Users />} />
          <Route path='/settings' element={<Settings/>} />
        </Route>
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
