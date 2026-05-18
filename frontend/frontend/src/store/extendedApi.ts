import { api } from "./api";

type Transaction = {
  transactionId: number;
  symbol: string;
  type: string;
  quantity: number;
  priceAtTransaction: number;
  totalAmount: number;
  createdAt: string;
};

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query<any[], void>({
      query: () => "/stocks",
      providesTags: ["Stocks"],
    }),

    getPortfolio: builder.query<any, void>({
      query: () => "/portfolio",
      providesTags: ["Portfolio"],
    }),

    getTransactions: builder.query<
    {
      items: Transaction[];
      currentPage:number;
      pageSize:number;
      totalPages:number;
      totalCount:number;
    },
    {
      page:number;
      pageSize:number;
    }
    >({
      query: ({ page, pageSize }) => ({
        url: `/transactions`,
        params: {
          page,
          pageSize
        }
      }),
    
      providesTags:["Transactions"]
    }),
  
    buyStock: builder.mutation<
      void,
      { symbol: string; quantity: number }
    >({
      query: (body) => ({
        url: "/portfolio/buy",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          extendedApi.util.updateQueryData(
            "getPortfolio",
            undefined,
            (draft: any) => {
              const holding = draft.holdings.find(
                (h: any) => h.symbol === arg.symbol
              );

              if (holding) {
                holding.quantity += arg.quantity;
              } else {
                draft.holdings.push({
                  symbol: arg.symbol,
                  quantity: arg.quantity,
                  currentPrice: 0,
                  totalValue: 0,
                });
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },

      invalidatesTags: ["Portfolio", "Stocks", "Transactions"],
    }),

    sellStock: builder.mutation<
      void,
      { symbol: string; quantity: number }
    >({
      query: (body) => ({
        url: "/portfolio/sell",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          extendedApi.util.updateQueryData(
            "getPortfolio",
            undefined,
            (draft: any) => {
              const holding = draft.holdings.find(
                (h: any) => h.symbol === arg.symbol
              );

              if (holding) {
                holding.quantity -= arg.quantity;

                if (holding.quantity <= 0) {
                  draft.holdings = draft.holdings.filter(
                    (h: any) => h.symbol !== arg.symbol
                  );
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },

      invalidatesTags: ["Portfolio", "Stocks", "Transactions"],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetPortfolioQuery,
  useGetTransactionsQuery,
  useBuyStockMutation,
  useSellStockMutation,
} = extendedApi;