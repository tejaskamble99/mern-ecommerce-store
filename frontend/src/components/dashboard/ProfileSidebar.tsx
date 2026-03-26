import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { FaClipboardList } from "react-icons/fa";

const ProfileSiderbar = () => {
 const pathname = usePathname();

    return (
        <>
        <div>
            <h5>My Account</h5>
            <ul>
                <Li
                  url="/dashboard"
                  text="Dashboard"
                  Icon={FaClipboardList}
                  location={pathname}
                />
            </ul>
        </div>
        </>
    )
}

interface LiProps {
  url: string;
  text: string;
  location: string;
  Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: location === url ? "rgba(0,104,136,0.1)" : "white",
    }}
  >
    <Link
      href={url}
      style={{
        color: location === url ? "rgb(0,104,136)" : "black",
      }}
    >
      <Icon />
      {text}
    </Link>
  </li>
);


export default ProfileSiderbar;
