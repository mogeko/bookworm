import * as hooks from "@/lib/hooks/useBooks";

const mock = jest.spyOn(hooks, "useBooksInfinite");
const setSizeMock = jest.fn();

const useBooksInfiniteMock = {
  target: hooks.useBooksInfinite,
  returnResult: (x = 3, y = 10) => ({
    success: () => mock.mockImplementation(() => genExampleRes({}, [x, y])),
    error: () =>
      mock.mockImplementation(() =>
        genExampleRes({ data: undefined, isError: true }, [x, y])
      ),
    loading: () =>
      mock.mockImplementation(() =>
        genExampleRes({ data: undefined, isLoading: true }, [x, y])
      ),
  }),
  exampleData: hooks.exampleData,
  genExampleBooks,
  genExampleRes,
  setSizeMock,
};

function genExampleRes(res: Partial<ResType> = {}, [x, y] = [3, 10]): ResType {
  const exampleRes = {
    data: genExampleBooks({}, [x, y]),
    isValidating: false,
    isError: false,
    isLoading: false,
    mutate: jest.fn(),
    setSize: setSizeMock,
    size: 1,
  };

  return { ...exampleRes, ...res };
}

function genExampleBooks(data: Partial<BookTypes> = {}, [x, y] = [3, 10]) {
  return Array.from({ length: x }, () =>
    Array.from({ length: y }, () => ({ ...hooks.exampleData, ...data }))
  );
}

type ResType = ReturnType<typeof hooks.useBooksInfinite>;
type BookTypes = hooks.BookTypes;

export default useBooksInfiniteMock;
