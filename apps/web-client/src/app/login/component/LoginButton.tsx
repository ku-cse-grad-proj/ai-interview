interface LoginButtonProps {
  text: string
  children: React.ReactNode
}

export default function LoginButton({ text, children }: LoginButtonProps) {
  return (
    <button
      className="w-72 h-12 px-3 py-[10px] bg-white/5 rounded-2xl  outline outline-1 outline-offset-[-1px] outline-white/40 
         inline-flex justify-center items-center gap-2.5
        hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] hover:backdrop-blur-[20px]
        transition-all duration-300 ease-in-out"
    >
      {children}
      <span className="w-[140px]">{text}</span>
    </button>
  )
}
