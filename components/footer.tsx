const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-8">
      <p>
        &copy; {new Date().getFullYear()} Happy Game. Todos os direitos
        reservados.
      </p>
    </footer>
  );
};

export default Footer;
