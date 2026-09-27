import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { userDashboard } from "@/lib/api/super-admin/super-admin-server";
import {
  UserPlus,
  UserRound,
  UserCog,
  CarFront,
  ShieldCheck,
  FileText,
  Clock3,
  BadgeCheck,
  CircleX,
  Wrench,
  CalendarCheck,
  CircleCheck,
} from "lucide-react";
import { RolesOverview } from "./roles-dashboard";
import { NewUsersChart } from "./users-area-chart";

export default async function DashboardInfo({ dashboard }) {
  const userData = [
    {
      label: "New users",
      total: dashboard?.newUsersLast7Days ?? "-",
      icon: <UserPlus />,
      bg: "bg-blue-200 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "Users who registered in the past 7 days",
    },
    {
      label: "Applicant",
      total: dashboard?.applicant ?? "-",
      icon: <UserRound />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Total users with the applicant role",
    },
    {
      label: "Application Admin",
      total: dashboard?.applicationAdmin ?? "-",
      icon: <UserCog />,
      bg: "bg-purple-200 text-purple-600",
      mainBg: "bg-purple-100",
      tooltip: "Total users with the application admin role",
    },
    {
      label: "Vehicle Admin",
      total: dashboard?.vehicleAdmin ?? "-",
      icon: <CarFront />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "Total users with the vehicle admin role",
    },
    {
      label: "Super Admin",
      total: dashboard?.superAdmin ?? "-",
      icon: <ShieldCheck />,
      bg: "bg-red-200 text-red-600",
      mainBg: "bg-red-100",
      tooltip: "Total users with the super admin role",
    },
  ];
  // const applications_data = [
  //   {
  //     id: "1",
  //     icon: <FileText />,
  //     label: "New Applications",
  //     total: "2",
  //     bg: "bg-blue-100 text-blue-600",
  //   },
  //   {
  //     id: "2",
  //     icon: <Clock3 />,
  //     label: "Pending",
  //     total: "3",
  //     bg: "bg-amber-100 text-amber-600",
  //   },
  //   {
  //     id: "3",
  //     icon: <BadgeCheck />,
  //     label: "Approved",
  //     total: "4",
  //     bg: "bg-green-100 text-green-600",
  //   },
  //   {
  //     id: "4",
  //     icon: <CircleX />,
  //     label: "Rejected",
  //     total: "2",
  //     bg: "bg-red-100 text-red-600",
  //   },
  // ];
  // const vehicles_data = [
  //   {
  //     id: "1",
  //     icon: <CarFront />,
  //     label: "All Vehicle",
  //     total: "2",
  //     bg: "bg-blue-100 text-blue-600",
  //   },
  //   {
  //     id: "2",
  //     icon: <Wrench />,
  //     label: "Under Maintenance",
  //     total: "3",
  //     bg: "bg-amber-100 text-amber-600",
  //   },
  //   {
  //     id: "3",
  //     icon: <CalendarCheck />,
  //     label: "Scheduled This Week",
  //     total: "4",
  //     bg: "bg-purple-100 text-purple-600",
  //   },
  //   {
  //     id: "4",
  //     icon: <CircleCheck />,
  //     label: "Available This Week",
  //     total: "2",
  //     bg: "bg-green-100 text-green-600",
  //   },
  // ];
  return (
    <div>
      <Title
        title2="Dashboard"
        // description="View an overview of users, applications, and vehicles."
        description="View an overview of users."
      />
      <InfoCardContainer title="Accounts">
        {userData.map((user) => {
          return (
            <Tooltip key={user.label}>
              <TooltipTrigger
                render={
                  <InfoCard
                    // key={status.label}
                    mainBg={user.mainBg}
                    icon={user.icon}
                    label={user.label}
                    total={user.total}
                    bg={user.bg}
                  />
                }
              ></TooltipTrigger>
              <TooltipContent>
                <p>{user.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </InfoCardContainer>
      <div className="my-2 flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="w-full lg:w-[35%]">
          <NewUsersChart data={dashboard.dailyNewUsers} />
        </div>
        <div className="w-full lg:w-[65%]">
          <RolesOverview users={dashboard} />
        </div>
      </div>
      {/* <InfoCardContainer title="Applications">
        {applications_data.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>

      <InfoCardContainer title="Vehicles">
        {vehicles_data.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer> */}
    </div>
  );
}
