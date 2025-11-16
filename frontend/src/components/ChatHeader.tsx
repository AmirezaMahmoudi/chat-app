import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null; // nothing to render if no user selected

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const isOnline = selectedUser._id && onlineUsers?.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar relative">
            {selectedUser.profilePic ? (
              <div className="w-10 rounded-full">
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.fullname || "User"}
                  className="object-cover rounded-full"
                />
              </div>
            ) : (
              <div className={`avatar avatar-placeholder w-10 rounded-full `}>
                <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                  <span>{getInitials(selectedUser.fullname)}</span>
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
