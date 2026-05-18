import { useGetUsersQuery } from "../store/adminApi";
import { useGetAllTransactionsQuery } from "../store/adminApi";
import TransactionsCard from "./TransactionsCard";
import UsersCard from "./UsersCard";

export default function Admin() {
  const { data: users = [], isLoading: usersLoading } =
    useGetUsersQuery();

  const {
    data: transactionsData,
    isLoading: txLoading,
  } = useGetAllTransactionsQuery({
    page: 1,
    pageSize: 10,
  });

  const transactions = transactionsData?.items ?? [];

  if (usersLoading || txLoading) {
    return (
      <div className="container">
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        Admin Panel
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <UsersCard users={users} />
        <TransactionsCard transactions={transactions} />
      </div>
    </div>
  );
}