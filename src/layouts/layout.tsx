import Header from "@/layouts/header";
import Footer from "@/layouts/footer";

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col min-h-screen min-w-full w-full"
      id="container"
    >
      {children}
    </div>
  );
};

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="flex-1 max-w-screen-lg w-full mx-auto p-6 md:p-4">
      {children}
    </main>
  );
};

export const DefaultLayout: React.FC<MainProps> = ({ children }) => {
  return (
    <Container>
      <Header />
      <Main>{children}</Main>
      <Footer time={2022} author="Zheng Junyi" />
    </Container>
  );
};

const Layout = Object.assign(Container, { Main, Header, Footer });

interface ContainerProps {
  children: React.ReactNode;
}

interface MainProps {
  children: React.ReactNode;
}

export default Layout;
