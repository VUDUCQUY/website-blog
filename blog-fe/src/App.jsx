function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center p-10 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          CHÚC MỪNG QUÝ! 🚀
        </h1>
        <p className="text-slate-400 text-xl">
          Codebase React + Tailwind v4 + Vite đã thông suốt.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <div className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-mono border border-cyan-500/20">
            frontend/src
          </div>
          <div className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-mono border border-blue-500/20">
            Ready to Code
          </div>
        </div>
      </div>
    </div>
  )
}

export default App