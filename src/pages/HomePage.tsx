const HomePage = () => {
    const dataDefault = [{ id: 1, name: 'Nguyen Van A' }, { id: 2, name: 'Nguyen Van B' }, { id: 3, name: 'Nguyen Van C' }];
    return (
        <div>
            <h1>Trang chủ</h1>
            <p>Đây là trang chủ</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {dataDefault.map((item) => ( // dùng map để hiển thị data cho array => chú ý cần có key=...
                        // và chỉ dùng 1 thẻ để bọc các dòng code bên trong
                        // vd: <div>(code khác)</div>, <>(code khác)</>, ...
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HomePage;