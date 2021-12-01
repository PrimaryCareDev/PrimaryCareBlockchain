import HomeIcon from './icons/home';
import TasksIcon from './icons/tasks';
import ReportsIcon from './icons/reports';
import SettingsIcon from './icons/settings';
import CalendarIcon from './icons/calendar';
import ProjectsIcon from './icons/projects';
import TimeManageIcon from './icons/time-manage';
import DocumentationIcon from './icons/documentation';

const doctorNav = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    link: '/doctor',
  },
  {
    title: 'Patients',
    icon: <ProjectsIcon />,
    link: '/doctor/patients',
  },

];

export default doctorNav;
