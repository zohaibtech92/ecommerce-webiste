
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} MERN E-Commerce Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;