-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "UserRoles_uid_fkey";

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "UserRoles_uid_fkey" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
