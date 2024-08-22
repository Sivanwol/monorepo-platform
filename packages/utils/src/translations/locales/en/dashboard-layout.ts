import type { DynamicStructure, InputOptions } from "../../type";

const translate: DynamicStructure = {
  "title": "Application Name Backoffice Panel",
  "shortTitle": "Application Name",
  "dashboard": "Dashboard",
  "support": "Help & Support",
  "toggle-sidebar": "Toggle Sidebar",
  "user": {
    "profile": "User Profile",
    "settings": "Settings",
    "logout": "Logout"
  },
  "notifications": {
    "title": "Notifications",
    "new": (options: InputOptions) => `${options.count} new notifications`,
    "empty": "No notifications available",
    "mark-all": "Mark all as read",
    "view-all": "View all"
  },
};

export default translate
