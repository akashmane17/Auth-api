const Navbar = () => {
  return (
    <header className=" bg-blue-500">
      <nav className="mx-auto bg-blue-500 px-6 py-4 flex items-center justify-between max-w-7xl">
        <a href="/">
          <div className="flex justify-between items-center">
            <div className="rounded-full w-6 h-6 bg-white mr-1"></div>
            <span className="text-xl text-white font-medium">Auth API</span>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <a href="/auth/login" className="text-xl text-white font-normal">
            Login
          </a>
          <a href="/auth/login" className="text-xl text-white font-normal">
            Login
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
