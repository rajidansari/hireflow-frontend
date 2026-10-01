import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, ChevronRight, Clock3, Mail, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  deleteAllNotificationsApi,
  deleteOneNotificationApi,
  deleteReadNotificationsApi,
  getNotificationsApi,
  markReadAllNotificationsApi,
  markReadNotificationApi,
} from "@/api/notifications";
import { toast } from "sonner";
import { SpinnerButton } from "./ui/SpinnerButton";

const iconFor = (kind) => (kind === "application" ? Mail : kind === "profile" ? Bell : Clock3);

function NotificationsDrawer({ open, setOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch notifications
  useEffect(() => {
    if (!open) return;

    const fetchNotifications = async () => {
      try {
        const response = await getNotificationsApi();

        setNotifications(response.data.data);
      } catch (err) {
        console.error(`Failed to fetch notifications :: ${err}`);
        toast.error(err.response?.data?.message || "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [open]);

  // read one
  const markRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, seen: true } : notification
        )
      );

      await markReadNotificationApi(id);
      toast.success(`Marked as seen`);
    } catch (err) {
      console.error(`Failed to mark read :: ${err}`);
      toast.error(`Failed to mark read`);
    }
  };

  // read all
  const markAllRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => {
          return { ...notification, seen: true };
        })
      );

      await markReadAllNotificationsApi();
      toast.success(`Marked all as seen`);
    } catch (err) {
      console.error(`Failed to mark read :: ${err}`);
      toast.error(`Failed to mark read`);
    }
  };

  // delete one
  const deleteOne = async (id) => {
    try {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));

      await deleteOneNotificationApi(id);
      toast.success(`Deleted successfully`);
    } catch (err) {
      console.error(`Failed to delete :: ${err}`);
      toast.error(`Failed to delete`);
    }
  };

  // delete all
  const deleteAll = async () => {
    try {
      setNotifications([]);
      await deleteAllNotificationsApi();
      toast.success(`Deleted Successfully`);
    } catch (err) {
      console.error(`Failed to delete :: ${err}`);
      toast.error(`Failed to delete`);
    }
  };

  // delete read
  const deleteRead = async () => {
    try {
      setNotifications((prev) => prev.filter((notification) => !notification.seen));

      await deleteReadNotificationsApi();
      toast.success(`Deleted Successfully`);
    } catch (err) {
      console.error(`Failed to delete :: ${err}`);
      toast.error(`Failed to delete`);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.seen).length;

  if (loading) {
    return <SpinnerButton />;
  }

  return (
    <main className="min-h-svh bg-[#f4f7fb] p-4 sm:p-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full gap-0 border-l-0 p-0 shadow-2xl sm:max-w-md">
          <SheetHeader className="border-b bg-linear-to-br from-primary/10 via-background to-background px-5 pb-5 pt-6 pr-14">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Bell className="size-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    HireFlow inbox
                  </span>
                </div>
                <SheetTitle className="text-2xl font-bold">Notifications</SheetTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  You have {unreadCount} unread update{unreadCount === 1 ? "" : "s"}.
                </p>
              </div>
            </div>
          </SheetHeader>
          <div className="border-b px-5 py-3">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg cursor-pointer"
                onClick={markAllRead}
                disabled={!unreadCount}
              >
                <CheckCheck className="mr-1.5 size-3.5" />
                Mark all read
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg cursor-pointer"
                onClick={deleteRead}
                disabled={notifications.every((item) => !item.seen)}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Delete read
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-lg text-destructive hover:text-destructive cursor-pointer"
                onClick={deleteAll}
                disabled={!notifications.length}
              >
                <X className="mr-1.5 size-3.5" />
                Delete all
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {notifications.length ? (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = iconFor(notification.kind);
                  return (
                    <article
                      key={notification.id}
                      className={`group rounded-2xl border p-4 transition-colors ${notification.seen ? "bg-background" : "border-primary/20 bg-primary/[0.045] shadow-sm"}`}
                    >
                      <div className="flex gap-3">
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${notification.seen ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h2 className="text-sm font-semibold">
                                {notification.type?.replace("_", " ").toUpperCase()}
                              </h2>
                              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.seen && (
                              <span
                                className="mt-1 size-2 shrink-0 rounded-full bg-primary"
                                aria-label="Unread"
                              />
                            )}
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-70 sm:group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-lg text-muted-foreground hover:text-primary cursor-pointer"
                                onClick={() => markRead(notification.id)}
                                disabled={notification.seen}
                                aria-label={notification.seen ? "Already read" : "Mark as read"}
                                title={notification.seen ? "Already read" : "Mark as read"}
                              >
                                <Check className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                                onClick={() => deleteOne(notification.id)}
                                aria-label="Delete notification"
                                title="Delete notification"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-lg text-muted-foreground"
                                aria-label="Open notification"
                              >
                                <ChevronRight className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center text-center">
                <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <Check className="size-6 text-primary" />
                </span>
                <h2 className="font-semibold">You’re all caught up</h2>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  There are no notifications waiting for you.
                </p>
              </div>
            )}
          </div>
          <div className="border-t bg-muted/30 px-5 py-4 text-center text-xs text-muted-foreground">
            Notifications are kept for 30 days
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}

export default NotificationsDrawer;
