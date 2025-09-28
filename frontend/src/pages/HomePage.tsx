import Sidebar from "../components/Sidebar";
import NoChat from "../components/NoChat";
import ChatConntainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center p-6">
          <div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(100vh-3rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />

              {!selectedUser ? <NoChat /> : <ChatConntainer  />}
            </div>
          </div>
        </div>
      </div>
  );
};

export default HomePage;
