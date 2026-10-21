
import { PageTitle } from "@/components/common";
import { UserPwEdit } from "@/components/user";

export const  UserPwEditPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="menu.user.pwEdit"
        defaultValue="패스워드 변경"
      />
      <div className="mt-5 flex flex-col gap-5">
        <UserPwEdit />
      </div>
    </>
  );
}

export default UserPwEditPage;