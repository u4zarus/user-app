interface UserPageProps {
    params: {
        id: string;
    };
}

const UserPage = async ({ params }: UserPageProps) => {
    const { id } = await params;

    return <div>User page {id}</div>;
};

export default UserPage;
