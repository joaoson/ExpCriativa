import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      image: "",
      initial: "SJ",
    },
    action: "uploaded",
    target: "Physics lecture notes",
    time: "2 hours ago",
    type: "resource",
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      image: "",
      initial: "MC",
    },
    action: "published",
    target: "Mathematics quiz results",
    time: "4 hours ago",
    type: "assessment",
  },
  {
    id: 3,
    user: {
      name: "Emma Davis",
      image: "",
      initial: "ED",
    },
    action: "updated",
    target: "Curriculum schedule",
    time: "5 hours ago",
    type: "schedule",
  },
  {
    id: 4,
    user: {
      name: "James Wilson",
      image: "",
      initial: "JW",
    },
    action: "added",
    target: "10 new students",
    time: "1 day ago",
    type: "students",
  },
  {
    id: 5,
    user: {
      name: "Olivia Martinez",
      image: "",
      initial: "OM",
    },
    action: "created",
    target: "New AI research lab",
    time: "1 day ago",
    type: "facility",
  },
];

const getBadgeVariant = (type: string) => {
  const variants: Record<string, "default" | "outline" | "secondary" | "destructive"> = {
    resource: "default",
    assessment: "secondary",
    schedule: "outline",
    students: "secondary",
    facility: "default",
  };
  
  return variants[type] || "outline";
};

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.image} alt={activity.user.name} />
                <AvatarFallback className="bg-lumen-100 text-lumen-700">
                  {activity.user.initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span>{activity.user.name}</span>
                  <span className="text-gray-500"> {activity.action} </span>
                  <span>{activity.target}</span>
                </p>
                <p className="flex items-center text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
              <Badge variant={getBadgeVariant(activity.type)}>
                {activity.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;