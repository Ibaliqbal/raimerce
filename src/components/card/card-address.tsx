import { useGetUserLogin } from "@/context/user-context";
import { MdPerson, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const CardAddress = () => {
  const data = useGetUserLogin();
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3 p-3 rounded-md">
        <MdPerson className="w-5 h-5 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium">{data?.user?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-md">
        <MdEmail className="w-5 h-5 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{data?.user?.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-md">
        <MdPhone className="w-5 h-5 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{data?.user?.phone ?? "-"}</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-3 rounded-md">
        <MdLocationOn className="w-5 h-5 text-gray-500 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">
            {data?.user?.address
              ? `${data.user.address.spesific}, ${data.user.address.district}, ${data.user.address.city},
              Indonesia`
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardAddress;
