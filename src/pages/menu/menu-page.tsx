import { PageTitle } from '@/components/common';
import { MenuContainer, MenuFetcher, MenuProvider } from '@/components/menu';

export const MenuPage = () => {
  return (
    <MenuProvider>
      <PageTitle
        i18nKey="menu.menu"
        defaultValue="메뉴 관리"
      />
      <MenuFetcher>
        <MenuContainer />
      </MenuFetcher>
    </MenuProvider>
  );
};

export default MenuPage;