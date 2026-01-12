import { notifications } from "@mantine/notifications";

const AdminHeader = () => {
    return (
        <div className="h-[60px] bg-stone-700 border-black">
            Admin Header
            <button onClick={() => notifications.show({
                color: "green",
                title: "Đã click",
                message: "hiển thị thành công",
            })}
            >Click</button>
        </div>
    );
}

export default AdminHeader;
