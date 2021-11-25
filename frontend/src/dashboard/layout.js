import Main from './main';
import Overlay from './provider/overlay';
import TopNavigation from './topnavigation';
import SideNavigation from './sidenavigation';
import { useToggle } from './provider/context';

const style = {
  open: 'lg:w-full',
  close: ' lg:w-99',
  mainContainer: `flex flex-col w-full h-screen pl-0 lg:space-y-4`,
  container: `bg-gray-100 h-screen overflow-hidden relative`,
  main: `h-screen overflow-auto px-2 pb-36 pt-2 md:pb-8 md:pt-4 lg:pt-8 lg:px-8`,
};

export default function DashboardLayout({ children }) {
  const { open } = useToggle();
  return (
    <div className={style.container}>
      <div className="flex items-start">
        <Overlay />
        <SideNavigation mobilePosition="right" />
        <div
          className={`${style.mainContainer} 
          ${open ? style.open : style.close}`}
        >
          <TopNavigation />
          <Main className={style.main}>{children}</Main>
        </div>
      </div>
    </div>
  );
}
