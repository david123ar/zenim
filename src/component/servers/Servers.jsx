import {
  faClosedCaptioning,
  faFile,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import "./Servers.css";
import { useEffect } from "react";

function Servers({
  servers,
  activeEpisodeNum,
  activeServerId,
  activeServerType,
  activeServerName,
  animeId,
  episodeId,
  WatchedEpisodes,
  setActiveServerId,
  setActiveServerType,
  setActiveServerName,
  serverLoading,
}) {
  const subServers = servers?.filter((server) => server.type === "sub") || [];
  const dubServers = servers?.filter((server) => server.type === "dub") || [];
  const rawServers = servers?.filter((server) => server.type === "raw") || [];

  useEffect(() => {
    const savedServerName =
      typeof window !== "undefined" && localStorage.getItem("server_name");

    const savedServerType =
      typeof window !== "undefined" && localStorage.getItem("server_type");

    if (savedServerName && savedServerType) {
      const matchingServer = servers?.find(
        (server) =>
          server.serverName === savedServerName &&
          server.type === savedServerType
      );

      if (matchingServer) {
        setActiveServerId(matchingServer.data_id);
        setActiveServerName(matchingServer.serverName);
        setActiveServerType(matchingServer.type);
      } else if (servers && servers.length > 0) {
        setActiveServerId(servers[0].data_id);
        setActiveServerName(servers[0].serverName);
        setActiveServerType(servers[0].type);
      }
    } else if (servers && servers.length > 0) {
      setActiveServerId(servers[0].data_id);
      setActiveServerName(servers[0].serverName);
      setActiveServerType(servers[0].type);
    }
  }, [servers]);

  const handleServerSelect = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerName(server.serverName);
    setActiveServerType(server.type);
    typeof window !== "undefined" &&
      localStorage.setItem("server_name", server.serverName);
    typeof window !== "undefined" &&
      localStorage.setItem("server_type", server.type);
  };
  return (
    <div className="relative bg-[#11101A] p-4 w-full min-h-[100px] flex justify-center items-center max-[1200px]:bg-[#14151A]">
      {serverLoading ? (
        <div className="w-full h-full rounded-lg flex justify-center items-center max-[600px]:rounded-none">
          <BouncingLoader />
        </div>
      ) : servers ? (
        <div className="responsiveCard">
          <div className="h-full bg-[#00f2fe] px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:h-1/2 max-[600px]:text-white max-[600px]:mb-4">
            <p className="text-center leading-5 font-medium text-[14px]">
              {`You are ${
                WatchedEpisodes.find(
                  (watched) => watched === animeId + "?ep=" + episodeId
                ) &&
                typeof window !== "undefined" &&
                localStorage.getItem(`${episodeId}-time`)
                  ? "Re-Watching"
                  : "watching"
              }`}{" "}
              <br />
              <span className="font-semibold max-[600px]:text-[#00f2fe]">
                Episode {activeEpisodeNum}
              </span>
            </p>
            <p className="leading-5 text-[14px] font-medium text-center">
              If the current server doesn&apos;t work, please try other servers
              beside.
            </p>
          </div>
          <div className="bg-[#201F31] flex flex-col max-[600px]:h-full">
            {rawServers.length > 0 && (
              <div
                className={`servers px-2 flex items-center flex-wrap ml-2 max-[600px]:py-2 ${
                  dubServers.length === 0 || subServers.length === 0
                    ? "h-1/2"
                    : "h-full"
                }`}
              >
                <div className="flex items-center gap-x-2">
                  <FontAwesomeIcon
                    icon={faFile}
                    className="text-[#00f2fe] text-[13px]"
                  />
                  <p className="font-bold text-[14px]">RAW:</p>
                </div>
                <div className="flex gap-x-[7px] ml-8 flex-wrap">
                  {rawServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#00f2fe] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subServers.length > 0 && (
              <div
                className={`servers px-2 flex items-center flex-wrap ml-2 max-[600px]:py-2 ${
                  dubServers.length === 0 ? "h-1/2" : "h-full"
                }`}
              >
                <div className="flex items-center gap-x-2">
                  <FontAwesomeIcon
                    icon={faClosedCaptioning}
                    className="text-[#00f2fe] text-[13px]"
                  />
                  <p className="font-bold text-[14px]">SUB:</p>
                </div>
                <div className="flex gap-x-[7px] ml-8 flex-wrap">
                  {subServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#00f2fe] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dubServers.length > 0 && (
              <div
                className={`servers px-2 flex items-center flex-wrap ml-2 max-[600px]:py-2 ${
                  subServers.length === 0 ? "h-1/2 " : "h-full"
                }`}
              >
                <div className="flex items-center gap-x-3">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="text-[#00f2fe] text-[13px]"
                  />
                  <p className="font-bold text-[14px]">DUB:</p>
                </div>
                <div className="flex gap-x-[7px] ml-8 flex-wrap">
                  {dubServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#00f2fe] text-black"
                          : "bg-[#373646] text-white"
                      } max-[700px]:px-3`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center font-medium text-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          Could not load servers <br />
          Either reload or try again after sometime
        </p>
      )}
    </div>
  );
}

export default Servers;
