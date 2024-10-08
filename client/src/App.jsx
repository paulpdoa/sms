import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from 'react';
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
import NewTeacher from "./pages/Registrar/NewTeacher";
import SchoolAdmin from './layouts/SchoolAdminLayout';
import Strands from "./pages/SuperAdmin/Strands";
import Textbook from "./pages/SuperAdmin/Textbook";
import PaymentTerm from "./pages/SuperAdmin/PaymentTerm";
import PaymentPenalty from "./pages/SuperAdmin/PaymentPenalty";
import PaymentSchedule from "./pages/SuperAdmin/PaymentSchedule";
import Admission from './pages/Registrar/Admission';
import FeeCategory from "./pages/SuperAdmin/FeeCategory";
import FeeCode from "./pages/SuperAdmin/FeeCode";
import NewParent from "./pages/Registrar/NewParent";
import Sibling from "./pages/Sibling";
import NewSibling from "./pages/Registrar/NewSibling";
import EditSibling from "./pages/Registrar/EditSibling";
import EditTeacher from "./pages/Registrar/EditTeacher";
import EditParent from "./pages/Registrar/EditParent";
import Discount from "./pages/Discount";
import Assessment from './pages/Registrar/Assessment';
import Sectioning from "./pages/Registrar/Sectioning";
import ManageFees from "./pages/Registrar/ManageFees";
import NewManageFee from "./pages/Registrar/NewManageFee";
import NationalityCode from "./pages/SuperAdmin/NationalityCode";
import EditManageFee from "./pages/Registrar/EditManagedFee";
import EditUser from "./components/master data/EditUser";
import { MainProvider } from "./helpers/MainContext";
import EditTextbook from "./components/master data/EditTextbook";
import NewTextbook from "./pages/SuperAdmin/NewTextbook";
import NewUser from "./pages/SuperAdmin/NewUser";
import { useCookies } from 'react-cookie';
import Profile from "./pages/Profile";
import Subjects from "./pages/SuperAdmin/Subjects";
import SubjectAssigning from "./pages/Registrar/SubjectAssigning";
import TeacherSubject from "./pages/Registrar/TeacherSubject";
import RoomNumber from "./pages/SuperAdmin/RoomNumber";
import EditTeacherSubject from "./pages/Registrar/EditTeacherSubject";
import StudentGrading from "./pages/Teacher/StudentGrading";
import GradingCategory from "./pages/SuperAdmin/GradingCategory";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentGrades from "./pages/Student/StudentGrades";
import StudentAttendance from "./pages/Student/StudentAttendance";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import ParentChildGrades from "./pages/Parent/ParentChildGrades";
import ParentPaymentSchedule from "./pages/Parent/ParentPaymentSchedule";
import ParentChildAttendance from "./pages/Parent/ParentChildAttendance";
import StudentPaymentSchedule from "./pages/Student/StudentPaymentSchedule";
import Finance from "./pages/Finance";
import NewFinance from "./pages/SuperAdmin/NewFinance";
import EditFinance from "./pages/EditFinance";
import FinanceDashboard from "./pages/Finance/FinanceDashboard";
import FinancePaymentSchedule from "./pages/Finance/FinancePaymentSchedule";
import TeacherStudentAttendance from "./pages/Teacher/TeacherStudentAttendance";
import TeacherLayout from "./layouts/TeacherLayout";
import Registration from "./pages/Registrar/Registration";
import StudentLayout from "./layouts/StudentLayout";
import RegistrarLayout from "./layouts/RegistrarLayout";
import FinanceLayout from "./layouts/FinanceLayout";
import ParentLayout from "./layouts/ParentLayout";
import SchoolAdminLayout from "./layouts/SchoolAdminLayout";
import ErrorPage from "./pages/ErrorPage";
import FinanceAccountPayment from "./pages/Finance/FinanceAccountPayment";
import PaymentHistoryTransaction from "./pages/Finance/PaymentHistoryTransaction";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
  const userToken = cookies.userToken;
  const role = localStorage.getItem('role');

  const checkFreshYear = () => {
    const isFreshYear = localStorage.getItem('isFreshYear');
    return isFreshYear === 'true';
  }; 


  // This will check if the userToken in cookies has been removed, it will also remove localStorage as well
  // useEffect(() => {
  //   if(!userToken) {
  //     ['id','currentUserId','session','role','username'].forEach(lclstg => localStorage.removeItem(lclstg));
  //   }
  // },[cookies])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<Login />} />
        <Route path='/login' element={userToken ? <Navigate to='/' /> : <Login />} />

        {/* For Signing up student record without logging in */}
        <Route path='/new-student' element={<NewStudent />} />
        {/* For Signing up student record without logging in */}


        <Route element={!userToken ? <Navigate to='/login' /> : <DashboardLayout />}>
          {/* <Route path='/' element={(checkFreshYear() && (role === 'School Admin' || role === 'Super Admin')) ? <Navigate to='/master/school-year' /> : <Dashboard />} /> */}
          <Route path='/students' element={checkFreshYear() ? <Navigate to='/master/school-year' /> : <Students />} />
          <Route path='/admission' element={checkFreshYear() ? <Navigate to='/master/school-year' /> : <Admission />} />
          
          
          {/* For Super admin routes */}
          <Route path='/master' element={(role === 'Super Admin' || role === 'School Admin') && <MasterLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='religion' element={<Religion />} />
            <Route path='nationality' element={<Nationality />} />
            <Route path='nationality-code' element={<NationalityCode />} />
            <Route path='gender' element={<Gender />} />
            <Route path='departments' element={<Department />} />
            <Route path='sections' element={<Section />} />
            <Route path='grade-levels' element={<GradeLevel />} />
            <Route path='requirements' element={<Requirements />} />
            <Route path='user-roles' element={<UserRoles />} />
            <Route path='students' element={<Students />} />
            <Route path='finance' element={<Finance />} />
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
            <Route path='siblings' element={<Sibling />} />
            <Route path='discount' element={<Discount />} />
            <Route path='sectioning' element={<Sectioning />} />
            <Route path='manage-fees' element={<ManageFees />} />
            <Route path='subjects' element={<Subjects />} />
            <Route path='room-number' element={<RoomNumber />} />
            <Route path='grading-category' element={<GradingCategory />} />
            <Route path='student-grading' element={<StudentGrading />} />
            <Route path='subject-assigning' element={<SubjectAssigning />} />
            <Route path='assessment' element={<Assessment />} />
            <Route path='teachers-subject' element={<TeacherSubject />} />
            <Route path='registration' element={<Registration />} />

            {/* For editing */}
            <Route path='edit-student/:id' element={<EditStudent />} />  
            <Route path='edit-sibling/:id' element={<EditSibling />} />
            <Route path='edit-teacher/:id' element={<EditTeacher />} />
            <Route path='edit-parent/:id' element={<EditParent />} />
            <Route path='edit-manage-fee/:id' element={<EditManageFee />} />
            <Route path='edit-finance/:id' element={<EditFinance />} />
            <Route path='edit-user/:id' element={<EditUser />} />
            <Route path='edit-textbook/:id' element={<EditTextbook />} />
            <Route path='teacher-subject/:id' element={<EditTeacherSubject />} />
            {/* For Adding */}
            <Route path='new-student' element={<NewStudent />} />
            <Route path='new-teacher' element={<NewTeacher />} />
            <Route path='new-parent' element={<NewParent />} />
            <Route path='new-user' element={<NewUser />} />
            <Route path='new-sibling' element={<NewSibling />} />
            <Route path='manage-fees' element={<ManageFees />} />
            <Route path='create-fees' element={<NewManageFee />} />
            <Route path='new-finance' element={<NewFinance />} />
            <Route path='new-textbook' element={<NewTextbook />} />
          </Route>

          {/* <Route path='/subjects' element={<Subjects />} />
          <Route path='/teachers' element={<Teachers />} />
          <Route path='/strands' element={<Strands />} />
          <Route path='/sectioning' element={<Sectioning />} />
          <Route path='/subject-assigning' element={<SubjectAssigning />} />
          <Route path='/teachers-subject' element={<TeacherSubject />} />
          <Route path='/assessment' element={<Assessment />} />
          <Route path='/teacher-subject/:id' element={<EditTeacherSubject />} />
          <Route path='/finance' element={<Finance />} />
          <Route path='/new-finance' element={<NewFinance />} /> */}

          {/* For teachers route */}
          <Route element={<TeacherLayout />}>
            <Route path='/teacher/student-grading' element={<StudentGrading />} />
            <Route path='/teacher/dashboard' element={role === 'Teacher' && <TeacherDashboard />  } />
            <Route path='/teacher/student-attendance' element={<TeacherStudentAttendance />} />


            {/* This will accept routes with subject id */}
            <Route path='/teacher/student-grading/:id' element={<StudentGrading />} />
          </Route>

          {/* For student routes */}
          <Route element={<StudentLayout />}>
            <Route path='/student/dashboard' element={<StudentDashboard />} />
            <Route path='/student/grades' element={<StudentGrades />} />
            <Route path='/student/attendance' element={<StudentAttendance />} />
            <Route path='/student/payment-schedule' element={<StudentPaymentSchedule />} />
          </Route>

          {/* For Parent Routes */}
          <Route element={<ParentLayout />}>
            <Route path='/parent/dashboard' element={<ParentDashboard />} />
            <Route path='/parent/grades' element={<ParentChildGrades />} />
            <Route path='/parent/payment-schedule' element={<ParentPaymentSchedule />} />
            <Route path='/parent/attendance' element={<ParentChildAttendance />} />
          </Route>

          {/* For Finance Routes */}
          <Route element={<FinanceLayout />}>
            <Route path='/finance/dashboard' element={<FinanceDashboard />} />
            <Route path='/finance/soa' element={<FinancePaymentSchedule />} />
            <Route path='/finance/account-payment' element={<FinanceAccountPayment />} />
            <Route path='/finance/payment-history' element={<PaymentHistoryTransaction />} />
          </Route>

          {/* Registrar Route */}
          <Route path='/registrar' element={<RegistrarLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='registration' element={<Registration />} />

            <Route path='dashboard' element={<Dashboard />} />
            <Route path='religion' element={<Religion />} />
            <Route path='nationality' element={<Nationality />} />
            <Route path='nationality-code' element={<NationalityCode />} />
            <Route path='gender' element={<Gender />} />
            <Route path='departments' element={<Department />} />
            <Route path='sections' element={<Section />} />
            <Route path='grade-levels' element={<GradeLevel />} />
            <Route path='requirements' element={<Requirements />} />
            <Route path='user-roles' element={<UserRoles />} />
            <Route path='students' element={<Students />} />
            <Route path='finance' element={<Finance />} />
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
            <Route path='siblings' element={<Sibling />} />
            <Route path='discount' element={<Discount />} />
            <Route path='sectioning' element={<Sectioning />} />
            <Route path='manage-fees' element={<ManageFees />} />
            <Route path='subjects' element={<Subjects />} />
            <Route path='room-number' element={<RoomNumber />} />
            <Route path='grading-category' element={<GradingCategory />} />
            <Route path='student-grading' element={<StudentGrading />} />
            <Route path='subject-assigning' element={<SubjectAssigning />} />
            <Route path='assessment' element={<Assessment />} />
            <Route path='teachers-subject' element={<TeacherSubject />} />
            <Route path='registration' element={<Registration />} />

            {/* For editing */}
            <Route path='edit-student/:id' element={<EditStudent />} />  
            <Route path='edit-sibling/:id' element={<EditSibling />} />
            <Route path='edit-teacher/:id' element={<EditTeacher />} />
            <Route path='edit-parent/:id' element={<EditParent />} />
            <Route path='edit-manage-fee/:id' element={<EditManageFee />} />
            <Route path='edit-finance/:id' element={<EditFinance />} />
            <Route path='edit-user/:id' element={<EditUser />} />
            <Route path='edit-textbook/:id' element={<EditTextbook />} />
            <Route path='teacher-subject/:id' element={<EditTeacherSubject />} />
            {/* For Adding */}
            <Route path='new-student' element={<NewStudent />} />
            <Route path='new-teacher' element={<NewTeacher />} />
            <Route path='new-parent' element={<NewParent />} />
            <Route path='new-user' element={<NewUser />} />
            <Route path='new-sibling' element={<NewSibling />} />
            <Route path='manage-fees' element={<ManageFees />} />
            <Route path='create-fees' element={<NewManageFee />} />
            <Route path='new-finance' element={<NewFinance />} />
            <Route path='new-textbook' element={<NewTextbook />} />
          </Route>

          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/new-textbook' element={<NewTextbook />} />
          
          <Route path='/schooladmin' element={<SchoolAdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='registration' element={<Registration />} />

            <Route path='dashboard' element={<Dashboard />} />
            <Route path='religion' element={<Religion />} />
            <Route path='nationality' element={<Nationality />} />
            <Route path='nationality-code' element={<NationalityCode />} />
            <Route path='gender' element={<Gender />} />
            <Route path='departments' element={<Department />} />
            <Route path='sections' element={<Section />} />
            <Route path='grade-levels' element={<GradeLevel />} />
            <Route path='requirements' element={<Requirements />} />
            <Route path='user-roles' element={<UserRoles />} />
            <Route path='students' element={<Students />} />
            <Route path='finance' element={<Finance />} />
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
            <Route path='siblings' element={<Sibling />} />
            <Route path='discount' element={<Discount />} />
            <Route path='sectioning' element={<Sectioning />} />
            <Route path='manage-fees' element={<ManageFees />} />
            <Route path='subjects' element={<Subjects />} />
            <Route path='room-number' element={<RoomNumber />} />
            <Route path='grading-category' element={<GradingCategory />} />
            <Route path='student-grading' element={<StudentGrading />} />
            <Route path='subject-assigning' element={<SubjectAssigning />} />
            <Route path='assessment' element={<Assessment />} />
            <Route path='teachers-subject' element={<TeacherSubject />} />
            <Route path='registration' element={<Registration />} />

            {/* For editing */}
            <Route path='edit-student/:id' element={<EditStudent />} />  
            <Route path='edit-sibling/:id' element={<EditSibling />} />
            <Route path='edit-teacher/:id' element={<EditTeacher />} />
            <Route path='edit-parent/:id' element={<EditParent />} />
            <Route path='edit-manage-fee/:id' element={<EditManageFee />} />
            <Route path='edit-finance/:id' element={<EditFinance />} />
            <Route path='edit-user/:id' element={<EditUser />} />
            <Route path='edit-textbook/:id' element={<EditTextbook />} />
            <Route path='teacher-subject/:id' element={<EditTeacherSubject />} />
            {/* For Adding */}
            <Route path='new-student' element={<NewStudent />} />
            <Route path='new-teacher' element={<NewTeacher />} />
            <Route path='new-parent' element={<NewParent />} />
            <Route path='new-user' element={<NewUser />} />
            <Route path='new-sibling' element={<NewSibling />} />
            <Route path='manage-fees' element={<ManageFees />} />
            <Route path='create-fees' element={<NewManageFee />} />
            <Route path='new-finance' element={<NewFinance />} />
            <Route path='new-textbook' element={<NewTextbook />} />
          </Route>

          <Route path='/siblings' element={<Sibling />} />
          <Route path='/parents' element={<Parents />} />
          <Route path='/library' element={<Library />} />
          <Route path='/account' element={<Account />} />
          <Route path='/users' element={<Users />} />
          <Route path='/settings' element={<Settings />} />
        </Route>

        {/* Catch guest dashboard to go to login page */}
        <Route path='/guest/dashboard' element={<Navigate to='/login' />} />

        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );

  return (
    <MainProvider>
      <RouterProvider router={router} />
    </MainProvider>
  );
}

export default App;
