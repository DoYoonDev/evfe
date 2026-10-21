import { PageTitle } from "@/components/common";
import { UserInfoEdit } from "@/components/user";

export const UserInfoEditPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="menu.user.edit"
        defaultValue="사용자 정보 수정"
      />
      <div className="mt-5 flex flex-col gap-5">
        <UserInfoEdit />
      </div>
    </>
  );
}

export default UserInfoEditPage;