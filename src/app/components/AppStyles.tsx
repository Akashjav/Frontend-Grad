export default function AppStyles() {
  return (
    <style>{`
        * { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        *:hover { scrollbar-color: #CBD5E1 transparent; }
        *::-webkit-scrollbar { width: 4px; height: 4px; }
        *::-webkit-scrollbar-thumb { background: transparent; border-radius: 9999px; }
        *:hover::-webkit-scrollbar-thumb { background: #CBD5E1; }
        h1, h2, h3, h4, h5 { font-family: 'Poppins', sans-serif; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        [disabled] { opacity: 0.6; cursor: not-allowed; }
      `}</style>
  );
}

