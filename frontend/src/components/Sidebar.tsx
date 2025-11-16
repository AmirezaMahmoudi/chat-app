import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User } from "lucide-react";
import SidebarSkeleton from "./SidebarSkeleton";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers, authUser, logout } = useAuthStore();

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isUsersLoading) return <SidebarSkeleton />;

  // Generate initials for fallback
  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all  duration-200">
      {/* User List */}
      <div className="overflow-y-auto w-full py-3 flex-1 rounded-xl">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
          >
            <div className="relative mx-auto lg:mx-0">
              {user.profilePic ? (
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.profilePic} alt={user.fullname || "User"} />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-neutral text-neutral-content w-10 rounded-full flex items-center justify-center">
                    <span>{getInitials(user.fullname)}</span>
                  </div>
                </div>
              )}

              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>

      {/* Current User Profile with Dropdown */}
      {authUser && (
        <div
          className="border-t border-base-300 p-3 relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full flex items-center gap-3 hover:bg-base-300 rounded-md p-2 transition-colors"
          >
            {authUser.profilePic ? (
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={authUser.profilePic} alt={authUser.fullname} />
                </div>
              </div>
            ) : (
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-10 rounded-full flex items-center justify-center">
                  <span>{getInitials(authUser.fullname)}</span>
                </div>
              </div>
            )}

            <div className="hidden lg:block text-left">
              <div className="font-medium truncate">{authUser.fullname}</div>
              <div className="text-xs text-zinc-400">My account</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-base-100 border border-base-300 shadow-md rounded-md py-2 z-50">
              <Link
                to="/profile"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200"
              >
                <User className="size-4" />
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
