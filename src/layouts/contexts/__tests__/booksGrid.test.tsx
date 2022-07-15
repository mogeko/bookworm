import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as books from "@/lib/connect/books";
import BooksGrid from "@/layouts/contexts/booksGrid";

const exampleBook = {
  title: "This is an example book",
  cover: "https://picsum.photos/seed/35613/1280/1920/",
  description: "This is an example book",
  published: "2020-1-1T23:59:59Z",
  publisher: "This is an example publisher",
  author: "No One",
  id: 1,
};

describe("booksGrid", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders a BooksGrid", () => {
    const exampleBooks = Array.from({ length: 20 }, () => exampleBook);
    const res = { books: exampleBooks, isError: false, isLoading: false };
    jest.spyOn(books, "default").mockImplementation(() => res);
    const { container } = render(<BooksGrid limit={20} />);

    expect(books.default).toBeCalledWith({ limit: 20 });
    expect(container.querySelectorAll("figure").length).toBe(10);
  });

  it("snapshot a BooksGrid", () => {
    const exampleBooks = Array.from({ length: 20 }, () => exampleBook);
    const res = { books: exampleBooks, isError: false, isLoading: false };
    jest.spyOn(books, "default").mockImplementation(() => res);
    const { container } = render(<BooksGrid limit={20} />);

    expect(container).toMatchSnapshot();
  });

  it("renders a BooksGrid then error", () => {
    const res = { books: [], isError: true, isLoading: false };
    jest.spyOn(books, "default").mockImplementation(() => res);
    render(<BooksGrid limit={20} />);

    expect(books.default).toBeCalledWith({ limit: 20 });
    expect(screen.getByText("Network Error!")).toBeInTheDocument();
  });

  it("snapshot a BooksGrid then error", () => {
    const res = { books: [], isError: true, isLoading: false };
    jest.spyOn(books, "default").mockImplementation(() => res);
    const { container } = render(<BooksGrid limit={20} />);

    expect(container).toMatchSnapshot();
  });

  it("renders a Display BooksGrid then loading", () => {
    const res = { books: [], isError: false, isLoading: true };
    jest.spyOn(books, "default").mockImplementation(() => res);
    const { container } = render(<BooksGrid limit={20} />);

    expect(books.default).toBeCalledWith({ limit: 20 });
    expect(container.querySelector("div.animate-pulse")).toBeInTheDocument();
  });

  it("snapshot a BooksGrid then loading", () => {
    const res = { books: [], isError: false, isLoading: true };
    jest.spyOn(books, "default").mockImplementation(() => res);

    const { container } = render(<BooksGrid limit={20} />);

    expect(container).toMatchSnapshot();
  });
});