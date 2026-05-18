import { api } from "./api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Transaction = {
  transactionId: number;
  symbol: string;
  type: string;
  quantity: number;
  priceAtTransaction: number;
  totalAmount: number;
  createdAt: string;
};

type PagedTransactions = {
  items: Transaction[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "admin/users",
    }),

    getAllTransactions: builder.query<
      PagedTransactions,
      { page: number; pageSize: number }
    >({
      query: ({ page, pageSize }) =>
        `admin/transactions?page=${page}&pageSize=${pageSize}`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetAllTransactionsQuery,
} = adminApi;