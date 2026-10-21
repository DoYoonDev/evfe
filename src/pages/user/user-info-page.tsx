import { PageTitle } from "@/components/common";
import { UserInfoForm } from "@/components/user"

export const UserInfoPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="menu.user.profile"
        defaultValue="사용자 프로필"
      />
      <div className="mt-5 flex flex-col gap-5">
        <UserInfoForm />
      </div>
    </>
  );
}

export default UserInfoPage